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
        })
    })


});

router.post('/user/get', function(req, res, next) {
    let userId=req.body.userId
        getNear().then(r => {
            getUser(userId).then(user => {
                res.send(JSON.stringify(user))
            })
        })


});

router.post('/points/get', function(req, res, next) {
    let userId=req.body.userId
    getNear().then(() => {
        getPoints(userId).then(points => {
            res.send(JSON.stringify(points))
        })
    })
});

router.post('/levels/get', function(req, res, next) {
    let userId=req.body.userId
    getNear().then(() => {
        getUserLevel(userId).then(r => {
            res.send(r)
        })
    })
});

router.post('/points/change', function(req, res, next) {
    let points=JSON.parse(req.body.points)
    console.log(points)
    getNear().then(() => {
        changePoints(JSON.stringify(points)).then(message => {
            res.send(message)
        })
    })
});

router.post('/level/change', function(req, res, next) {
    let levels=JSON.parse(req.body.level)
    getNear().then(() => {
        changeLevel(levels).then(message => {
            res.send(message)
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

async function changePoints(newPoints){
    await contract.updatePoints({points:newPoints})
    return "success"
}

async function changeLevel(userLevel){
    await contract.changeLevel({level:userLevel})
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