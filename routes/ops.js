var express = require('express');
var router = express.Router();
const nearApi=require("near-api-js")
const { connect } = nearApi;
const keyStore = new nearApi.keyStores.UnencryptedFileSystemKeyStore("C:\\Users\\iCONS HUB\\.near-credentials");
const config = {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

let contract=null;


/* GET users listing. */
router.post('/user/create', function(req, res, next) {
    getNear().then(r => {
        createUser().then(user => {
            res.send(JSON.stringify(user))
            res.end()
        })
    })


});

router.post('/user/get', function(req, res, next) {
    let userId=req.body.userId
        getNear().then(r => {
            getUser(userId).then(user => {
                res.send(JSON.stringify(user))
                res.end()
            })
        })


});

router.post('/points/get', function(req, res, next) {
    let userId=req.body.userId
    getNear().then(() => {
        getPoints(userId).then(points => {
            res.send(JSON.stringify(points))
            res.end()
        })
    })
});

router.post('/levels/get', function(req, res, next) {
    let userId=req.body.userId
    getNear().then(() => {
        getUserLevel(userId).then(r => {
            res.send(r)
            res.end()
        })
    })
});

router.post('/points/change', function(req, res, next) {
    let userId=req.body.userId
    let points=req.body.points
    console.log(points)
    getNear().then(() => {
        changePoints(userId,points).then(message => {
            res.send(message)
            res.end()
        })
    })
});

router.post('/level/change', function(req, res, next) {
    let level=req.body.level
    let userId=req.body.userId
    console.log(level,userId)
    getNear().then(() => {
        changeLevel(userId,level).then(message => {
            res.send(message)
            res.end()
        })
    })
});

async function createUser(){
    return await (await contract).createUser();
}

async function getUser(currUserId){
    return  await contract.getUser({userId:currUserId})
}

async function getPoints(userIdValue){
    return await contract.getCurrentUserPoints({userId:userIdValue})
}

async function getUserLevel(userIdValue){
    return await contract.getCurrentUserLevel({userId:userIdValue})
}

async function changePoints(userId,points){
    await contract.updatePoints({"userId":userId,"points":points})
    return "success"
}

async function changeLevel(userId,level){
    await contract.changeLevel({"userId":userId,"level":level})
    return "success"
}


async function getNear(){
    near=await connect(config)
    await getAccount()
}

async function getAccount(){
    account=await (await near).account("dev-1644155816482-76541360589791")
   contract = new nearApi.Contract(
        account,
        "dev-1644155816482-76541360589791",
        {
            viewMethods: ["getUser","getCurrentUserLevel","getCurrentUserPoints"],
            changeMethods: ["createUser","changeLevel","updatePoints"],
        }
    );

}
module.exports = router;