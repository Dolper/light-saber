import {Skybox} from "./skybox"
import {Tools} from "./tools"
import {LevelSystem} from "./LevelCotroller"
import {Sword} from "./sword"
import {getUserData, UserData} from '@decentraland/Identity'
import {getCurrentRealm} from '@decentraland/EnvironmentAPI'

const camera = Camera.instance
let sb = new Skybox()

let d = Tools.getRandomInt(0, 10)
let pin = Tools.getRandomInt(0, 10) + "" + Tools.getRandomInt(0, 10) + "" + d + "" + d
// pin='0002'

const levelSystem = new LevelSystem()
levelSystem.setSkyBox(sb)
let sword = new Sword((type) => {
    if (type == 'sword') {
        levelSystem.showQR(pin)
    } else if (type == 'pistol') {
        levelSystem.addShootComponent()
        levelSystem.startGame()
    }
})
levelSystem.setChangeHandsHandeler(() => {
    sword.changeHands()
})

levelSystem.setPistolKillHandeler(() => {
    sword.pistolKill()
})
let userData = null

function hashCode(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function connectSocket(pin) {
    const socket = new WebSocket("wss://s.dapp-craft.com/scene/" + pin);

    socket.onmessage = function (event) {
        try {
            const msg = JSON.parse(event.data)
            if (msg.type == 'rotate') {
                if (!sword.taken) {
                    sword.take()
                }
                levelSystem.hideQR(false)
                levelSystem.startGame()
                const Q = new Quaternion(msg.quat[0], msg.quat[1], -msg.quat[2], -msg.quat[3])
                const QQ = Quaternion.Euler(Q.eulerAngles.x + 90, Q.eulerAngles.y, Q.eulerAngles.z)
                sword.swordRotation.x = QQ.x
                sword.swordRotation.y = QQ.y
                sword.swordRotation.z = QQ.z
                sword.swordRotation.w = QQ.w
            } else if (msg.type == 'cmd') {
                if (msg.cmd == 'on') {
                    sword.switch()
                } else if (msg.cmd == 'changeHands') {
                    sword.changeHands()
                } else if (msg.cmd == 'changeColor') {
                    sword.changeColor()
                }
            }
        } catch (error) {
            log(error);
        }
    };

    socket.onopen = function (event) {
        log('init', userData)
        socket.send(JSON.stringify({
            type: 'init',
            data: userData,
            pin: pin
        }))

        levelSystem.setServerSendHandler((data) => {
            socket.send(JSON.stringify(data))
        })
    }
}

getUserData()
    .then(user => {
            userData = user
            userData.name = user.displayName ? user.displayName : userData.name
            pin = (hashCode(userData.name) % 10000).toString()
            log('user: ', userData.name, pin)
            getCurrentRealm().then(currentRealm => {
                userData.realm = currentRealm.displayName
            })
            connectSocket(pin)
        }
    )
    .catch(e => {
        log('getUserData error', e)
        connectSocket(pin)
    })

engine.addSystem(levelSystem)


