// All game singletons
const MAX_VAL = 100;
const START_LEVEL = 1;
const EVENT_PER_LEVEL = 8;
const STAGE_IDS = ["stage-1", "stage-2", "stage-3", "stage-4", "stage-5", "stage-6", "stage-7", "stage-8", "stage-9"];

let choiceId = null;
let eventsByLevel = {};
let eventMap = {};
let currentLevel;
let reincarnation;
let numEvent;
let currentEvent;
let player;
let currentMaxPage;
let currentPage;
let isEnd;
let endBuff;

let eventsPlayedThisState = new Set();
let soundMap = {};

window.onload = function() {

    // https://joaopereirawd.github.io/animatedModal.js/
    $("#demo01").animatedModal({
        animatedIn:'fadeIn',
        animatedOut:'fadeOut',
        animationDuration: '1.5s',
        beforeOpen: function() {
            console.log("The animation was called");
        },
        afterOpen: function() {
            console.log("The animation is completed");
        },
        beforeClose: function() {
            console.log("The animation was called");
        },
        afterClose: function() {
            console.log("The animation is completed");
        }
    });
    initTronWeb();
    soundMap["page"] = new Howl({
        src: ['sound/page.webm', 'sound/page.wav'],
    });
    soundMap["bgm"] = new Howl({
        src: ['sound/normal_bgm.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.5
    });
};

function initTronWeb() {
    const abi = [{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_hp","type":"uint256"},{"name":"_mp","type":"uint256"},{"name":"_str","type":"uint256"},{"name":"_intelli","type":"uint256"},{"name":"_san","type":"uint256"},{"name":"_luck","type":"uint256"},{"name":"_charm","type":"uint256"}],"name":"setCharacterAttributes","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCharacterNo","outputs":[{"name":"_characterNo","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hp","type":"uint256"},{"name":"_mp","type":"uint256"},{"name":"_str","type":"uint256"},{"name":"_intelli","type":"uint256"},{"name":"_san","type":"uint256"},{"name":"_luck","type":"uint256"},{"name":"_charm","type":"uint256"},{"name":"_mt","type":"uint256"}],"name":"checkLegal","outputs":[{"name":"_checkresult","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"isPositiveEffect","type":"uint256"}],"name":"affectCharacter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRand","outputs":[{"name":"_rand","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_characterId","type":"uint256"}],"name":"getCharacterDetails","outputs":[{"name":"_name","type":"string"},{"name":"_hp","type":"uint256"},{"name":"_mp","type":"uint256"},{"name":"_str","type":"uint256"},{"name":"_int","type":"uint256"},{"name":"_san","type":"uint256"},{"name":"_luck","type":"uint256"},{"name":"_charm","type":"uint256"},{"name":"_mt","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_hp","type":"uint256"},{"name":"_mp","type":"uint256"},{"name":"_str","type":"uint256"},{"name":"_intelli","type":"uint256"},{"name":"_san","type":"uint256"},{"name":"_luck","type":"uint256"},{"name":"_charm","type":"uint256"},{"name":"_mt","type":"uint256"}],"name":"insertCharacter","outputs":[{"name":"_id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"characterNo","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    const byteCode = '60806040526003600055600180553480156200001a57600080fd5b506040805161016081018252600561012082019081527f4164616d30000000000000000000000000000000000000000000000000000000610140830152815260646020808301829052928201526032606082018190526080820181905260a0820181905260c0820181905260e08201526000610100820181905260028054600181018083559190925282518051919460099093027f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0192620000e29284929091019062000379565b506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015561010082015181600801555050506002610120604051908101604052806040805190810160405280600581526020017f4164616d3100000000000000000000000000000000000000000000000000000081525081526020016064815260200160648152602001603281526020016032815260200160328152602001603281526020016032815260200160018152509080600181540180825580915050906001820390600052602060002090600902016000909192909190915060008201518160000190805190602001906200020092919062000379565b506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015561010082015181600801555050506002610120604051908101604052806040805190810160405280600581526020017f4164616d3200000000000000000000000000000000000000000000000000000081525081526020016064815260200160648152602001603281526020016032815260200160328152602001603281526020016032815260200160028152509080600181540180825580915050906001820390600052602060002090600902016000909192909190915060008201518160000190805190602001906200031e92919062000379565b506020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e0820151816007015561010082015181600801555050506200041e565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620003bc57805160ff1916838001178555620003ec565b82800160010185558215620003ec579182015b82811115620003ec578251825591602001919060010190620003cf565b50620003fa929150620003fe565b5090565b6200041b91905b80821115620003fa576000815560010162000405565b90565b610d85806200042e6000396000f3006080604052600436106100985763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166320ce6c48811461009d578063496e3a07146100cc5780634e02a280146100f357806354fd4d501461012057806357642f5b14610135578063600bc4ea146101505780638aa832b214610165578063a0509f4b1461022d578063c2085cba146102af575b600080fd5b3480156100a957600080fd5b506100ca60043560243560443560643560843560a43560c43560e4356102c4565b005b3480156100d857600080fd5b506100e161053e565b60408051918252519081900360200190f35b3480156100ff57600080fd5b506100e160043560243560443560643560843560a43560c43560e435610545565b34801561012c57600080fd5b506100e1610636565b34801561014157600080fd5b506100ca60043560243561063c565b34801561015c57600080fd5b506100e16109b4565b34801561017157600080fd5b5061017d600435610a23565b60405180806020018a815260200189815260200188815260200187815260200186815260200185815260200184815260200183815260200182810382528b818151815260200191508051906020019080838360005b838110156101ea5781810151838201526020016101d2565b50505050905090810190601f1680156102175780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b34801561023957600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526100e194369492936024939284019190819084018382808284375094975050843595505050602083013592604081013592506060810135915060808101359060a08101359060c08101359060e00135610b28565b3480156102bb57600080fd5b506100e1610c4a565b60006002898154811015156102d557fe5b90600052602060002090600902016008015460021415156102f557600080fd5b600280548a90811061030357fe5b60009182526020822060016009909202019081018a90556002810189905560038101889055600481018790556005810186905560068101859055600781018490559150881015610359576000600182015561049a565b606481600101541115610372576064600182015561049a565b60008160020154101561038b576000600282015561049a565b6064816002015411156103a4576064600282015561049a565b6000816003015410156103bd576000600382015561049a565b6064816003015411156103d6576064600382015561049a565b6000816004015410156103ef576000600482015561049a565b606481600401541115610408576064600482015561049a565b600081600501541015610421576000600582015561049a565b60648160050154111561043a576064600582015561049a565b600081600601541015610453576000600682015561049a565b60648160060154111561046c576064600682015561049a565b600081600701541015610485576000600782015561049a565b60648160070154111561049a57606460078201555b8060028a8154811015156104aa57fe5b9060005260206000209060090201600082018160000190805460018160011615610100020316600290046104df929190610c50565b506001820154816001015560028201548160020155600382015481600301556004820154816004015560058201548160050155600682015481600601556007820154816007015560088201548160080155905050505050505050505050565b6000545b90565b6000808910806105555750606489115b156105625750600061062a565b60008810806105715750606488115b1561057e5750600061062a565b600087108061058d5750606487115b1561059a5750600061062a565b60008610806105a95750606486115b156105b65750600061062a565b60008510806105c55750606485115b156105d25750600061062a565b60008410806105e15750606484115b156105ee5750600061062a565b60008310806105fd5750606483115b1561060a5750600061062a565b60008210806106195750600282115b156106265750600061062a565b5060015b98975050505050505050565b60015481565b600060028381548110151561064d57fe5b90600052602060002090600902016008015460001415151561066e57600080fd5b600280548490811061067c57fe5b9060005260206000209060090201905081600014156107265761069d6109b4565b6001820180549190910390556106b16109b4565b6002820180549190910390556106c56109b4565b6003820180549190910390556106d96109b4565b6004820180549190910390556106ed6109b4565b6005820180549190910390556107016109b4565b6006820180549190910390556107156109b4565b6007820180549190910390556107bc565b81600114156107bc576107376109b4565b60018201805491909101905561074b6109b4565b60028201805491909101905561075f6109b4565b6003820180549190910190556107736109b4565b6004820180549190910190556107876109b4565b60058201805491909101905561079b6109b4565b6006820180549190910190556107af6109b4565b6007820180549190910190555b6000816001015410156107d55760006001820155610916565b6064816001015411156107ee5760646001820155610916565b6000816002015410156108075760006002820155610916565b6064816002015411156108205760646002820155610916565b6000816003015410156108395760006003820155610916565b6064816003015411156108525760646003820155610916565b60008160040154101561086b5760006004820155610916565b6064816004015411156108845760646004820155610916565b60008160050154101561089d5760006005820155610916565b6064816005015411156108b65760646005820155610916565b6000816006015410156108cf5760006006820155610916565b6064816006015411156108e85760646006820155610916565b6000816007015410156109015760006007820155610916565b60648160070154111561091657606460078201555b8060028481548110151561092657fe5b90600052602060002090600902016000820181600001908054600181600116156101000203166002900461095b929190610c50565b506001820154816001015560028201548160020155600382015481600301556004820154816004015560058201548160050155600682015481600601556007820154816007015560088201548160080155905050505050565b600080600a60024260018443030360405180838152602001828152602001925050506020604051808303816000865af11580156109f5573d6000803e3d6000fd5b5050506040513d6020811015610a0a57600080fd5b5051811515610a1557fe5b0660010190508091505b5090565b6060600080600080600080600080600060028b815481101515610a4257fe5b60009182526020918290206009919091020180546040805160026001841615610100026000190190931692909204601f810185900485028301850190915280825291935091839190830182828015610adb5780601f10610ab057610100808354040283529160200191610adb565b820191906000526020600020905b815481529060010190602001808311610abe57829003601f168201915b505050505099508060010154985080600201549750806003015496508060040154955080600501549450806006015493508060070154925080600801549150509193959799909294969850565b600080610b3b8a8a8a8a8a8a8a8a610545565b905060018114610b4a57600080fd5b600080546001908101825560408051610120810182528e815260208082018f90529181018d9052606081018c9052608081018b905260a081018a905260c0810189905260e0810188905261010081018790526002805493840180825594528051805191936009027f405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace0192610be392849290910190610cd1565b506020820151600182015560408201516002820155606082015160038201556080820151600482015560a0820151600582015560c0820151600682015560e082015160078201556101009091015160089091015550506000549a9950505050505050505050565b60005481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610c895780548555610cc5565b82800160010185558215610cc557600052602060002091601f016020900482015b82811115610cc5578254825591600101919060010190610caa565b50610a1f929150610d3f565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610d1257805160ff1916838001178555610cc5565b82800160010185558215610cc5579182015b82811115610cc5578251825591602001919060010190610d24565b61054291905b80821115610a1f5760008155600101610d455600a165627a7a72305820993fe8986be407c246e8c51ba33a23d58881fb770d49bbb29939f86f616c5b4b0029';

    if (!window.tronWeb) {
        const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
        const fullNode = new HttpProvider('https://api.trongrid.io:8090'); // Full node http endpoint
        const solidityNode = new HttpProvider('https://api.trongrid.io:8091'); // Solidity node http endpoint
        const eventServer = 'https://api.trongrid.io/'; // Contract events http endpoint
        // const privateKey = 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0';
        const privateKey = '89f904a88b4f30df7e90e2a38675153573d56cb64beb9b196449cf34e6a37164';

        const tronWeb = new TronWeb(
            fullNode,
            solidityNode,
            eventServer,
            privateKey
        );

        window.tronWeb = tronWeb;
    }

    console.log('hex: ' + this.tronWeb.defaultAddress.hex.toString());
    console.log(this.tronWeb.defaultAddress);

    // const newContract = tronWeb.contract().new({
    //     abi: [{"constant":false,"inputs":[],"name":"getFreeStrippers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hatcheryStrippers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyStrippers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"coins","type":"uint256"}],"name":"calculateCoinSell","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"rt","type":"uint256"},{"name":"rs","type":"uint256"},{"name":"bs","type":"uint256"}],"name":"calculateTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"coins","type":"uint256"}],"name":"seedMarket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"amount","type":"uint256"}],"name":"devFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyCoins","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"lastHatch","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"hatchCoins","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"adr","type":"address"}],"name":"getCoinsSinceLastHatch","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"COINS_TO_HATCH_1STRIPPERS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"eth","type":"uint256"}],"name":"calculateCoinBuySimple","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buyCoins","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"STARTING_STRIPPERS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"referrals","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"claimedCoins","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"eth","type":"uint256"},{"name":"contractBalance","type":"uint256"}],"name":"calculateCoinBuy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"marketCoins","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sellCoins","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],
    //     bytecode: '6080604052620151806000556101f460019081556127106002556113886003556004805460ff1916909117905534801561003857600080fd5b506004805461010060a860020a03191633610100021790556109678061005f6000396000f3006080604052600436106101325763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663020bdf5481146101375780630a0f81681461014e57806312065fe01461017f578063158ef93e146101a65780631965dbbe146101cf57806319a3d0bb146101f05780631c3de07a14610205578063229824c41461021d5780633b6537551461023b5780633bc0461a1461024657806343b114fd1461025e578063467ece79146102735780634db4eff0146102945780636cb5d070146102b55780636e33bc13146102d6578063726ea051146102eb5780639a777d5d146103035780639c3807e61461030b5780639ca423b314610320578063a84e54bf14610341578063b89c70c014610362578063e13fafdb1461037d578063f5991a0514610392575b600080fd5b34801561014357600080fd5b5061014c6103a7565b005b34801561015a57600080fd5b506101636103f5565b60408051600160a060020a039092168252519081900360200190f35b34801561018b57600080fd5b50610194610409565b60408051918252519081900360200190f35b3480156101b257600080fd5b506101bb61040e565b604080519115158252519081900360200190f35b3480156101db57600080fd5b50610194600160a060020a0360043516610417565b3480156101fc57600080fd5b50610194610429565b34801561021157600080fd5b5061019460043561043c565b34801561022957600080fd5b5061019460043560243560443561045b565b61014c6004356104a8565b34801561025257600080fd5b506101946004356104c7565b34801561026a57600080fd5b506101946104de565b34801561027f57600080fd5b50610194600160a060020a0360043516610503565b3480156102a057600080fd5b5061014c600160a060020a0360043516610515565b3480156102c157600080fd5b50610194600160a060020a0360043516610669565b3480156102e257600080fd5b506101946106c7565b3480156102f757600080fd5b506101946004356106cd565b61014c6106da565b34801561031757600080fd5b5061019461078c565b34801561032c57600080fd5b50610163600160a060020a0360043516610792565b34801561034d57600080fd5b50610194600160a060020a03600435166107ad565b34801561036e57600080fd5b506101946004356024356107bf565b34801561038957600080fd5b506101946107ce565b34801561039e57600080fd5b5061014c6107d4565b60045460ff1615156103b857600080fd5b33600090815260056020526040902054156103d257600080fd5b336000908152600760209081526040808320429055600154600590925290912055565b6004546101009004600160a060020a031681565b303190565b60045460ff1681565b60056020526000908152604090205481565b3360009081526005602052604090205490565b60006104558260095430600160a060020a03163161045b565b92915050565b60006104a061046c600254846108b7565b61049b6003546104906104956104846002548a6108b7565b6104906003548c6108b7565b6108ed565b896108fc565b6108fc565b949350505050565b600954156104b557600080fd5b6004805460ff19166001179055600955565b60006104556104d78360046108b7565b60646108fc565b3360008181526006602052604081205490916104fe919061049090610669565b905090565b60076020526000908152604090205481565b600454600090819060ff16151561052b57600080fd5b33600090815260086020526040902054600160a060020a0316158015610568575033600081815260086020526040902054600160a060020a031614155b156105a357336000908152600860205260409020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0385161790555b6105ab6104de565b91506105b9826000546108fc565b336000908152600560205260409020549091506105d690826108ed565b336000908152600560208181526040808420949094556006808252848420849055600782528484204290556008825284842054600160a060020a03168452905291902054610629916104909085906108fc565b33600090815260086020908152604080832054600160a060020a0316835260069091529020556009546106619061049084600a6108fc565b600955505050565b60008054600160a060020a038316825260076020526040822054829161069991610694904290610913565b610925565b600160a060020a0384166000908152600560205260409020549091506106c09082906108b7565b9392505050565b60005481565b60006104558230316107bf565b60045460009060ff1615156106ee57600080fd5b610702346106fd303182610913565b6107bf565b905061071681610711836104c7565b610913565b6004549091506101009004600160a060020a03166108fc610736346104c7565b6040518115909202916000818181858888f1935050505015801561075e573d6000803e3d6000fd5b503360009081526006602052604090205461077990826108ed565b3360009081526006602052604090205550565b60015481565b600860205260009081526040902054600160a060020a031681565b60066020526000908152604090205481565b60006106c0838360095461045b565b60095481565b6004546000908190819060ff1615156107ec57600080fd5b6107f46104de565b92506107ff8361043c565b915061080a826104c7565b3360009081526006602090815260408083208390556007909152902042905560095490915061083990846108ed565b600955600454604051610100909104600160a060020a0316906108fc8315029083906000818181858888f1935050505015801561087a573d6000803e3d6000fd5b50336108fc6108898484610913565b6040518115909202916000818181858888f193505050501580156108b1573d6000803e3d6000fd5b50505050565b6000808315156108ca57600091506108e6565b508282028284828115156108da57fe5b04146108e257fe5b8091505b5092915050565b6000828201838110156108e257fe5b600080828481151561090a57fe5b04949350505050565b60008282111561091f57fe5b50900390565b600081831061093457816106c0565b50909190505600a165627a7a7230582065d6a80dd2cd6271d34991232dd74a1428544d798f568435a01749fbfd09b6760029'
    // });
    // console.log(newContract);

    const contractPromise = tronWeb.contract().at("41468fb3338cb63e698a5dca8094e201903b561857").then(function(result) {
        window.contract = result;
        console.error("contractPromise result:");
        console.error(result);
    });

    // tronWeb.transactionBuilder.createSmartContract({
    //     abi: abi,
    //     bytecode: byteCode,
    //     feeLimit: 30000
    // }, this.tronWeb.defaultAddress.hex.toString(), (err, transaction) => {
    //     if(err)
    //         return console.error(err);
    //
    //     console.group('Unsigned create smart contract transaction');
    //     console.log('- Issuer Address: ' + this.tronWeb.defaultAddress.hex.toString());
    //     console.log('- Transaction:\n' + JSON.stringify(transaction, null, 2), '\n');
    //     console.groupEnd();
    // });
}


// Nebulas

// var NebPay = require("nebpay");
// var nebPay = new NebPay();
//
// var nebulas = require("nebulas"),
//     Account = nebulas.Account,
//     neb = new nebulas.Neb();
// neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
// var dappAddress = "n1r59HEWHF3bLudBZnpdhhxrdkKNGz1nBKb";

let dummyId = 0;

// function getAdam0() {
//     const func = "getAdam0";
//     const from = Account.NewAccount().getAddressString();
//     const args = 0;
//     const callArgs = JSON.stringify([args]);
//     const value = "0";
//     const nonce = "0";
//     const gas_price = "1000000";
//     const gas_limit = "2000000";
//     const contract = {
//         "function": func,
//         "args": callArgs
//     }
//
//     neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
//         const result = resp.result;
//         const resultString = JSON.parse(result);
//         console.log("adam: ", resultString)
//     }).catch(function (err) {
//         console.log("net work unstable, rereading...");
//     })
// }

const CHARA_IMGS = {
    "亚当": "img/chara/adam.png",
    "医生": "img/chara/doctor.png",
    "修女": "img/chara/nun.png",
    "牧师": "img/chara/priest.png",
    "僧侣": "img/chara/monk.png",
    "黑骑士": "img/chara/darkknight.png",
    "白骑士": "img/chara/whiteknight.png",
    "蒙面的旅人": "img/chara/traveler.png",
    "密探": "img/chara/agent.png",
    "商人": "img/chara/merchant.png",
    "巫妖": "img/chara/lich.png",
    "盗贼": "img/chara/thief.png",
    "法师": "img/chara/mage.png",
    "夜枭": "img/chara/owl.png",
    "酒馆老板": "img/chara/innowner.png",
    "钱币": "img/chara/luckcoin.png",
    "矮人": "img/chara/dwarf.png",
    "猎人": "img/chara/hunter.png",
    "士兵": "img/chara/soldier.png",
    "邪恶的王": "img/chara/evalking.png",
    "善良的王": "img/chara/goodking.png",
    "朗格努斯": "img/chara/spear.png",
    "雷沃汀": "img/chara/firesword.png",
    "士兵": "img/chara/solider.png",
    "石中剑": "img/chara/stonesword.png",
    "野鬼": "img/chara/ghost.png",
    "史莱姆": "img/chara/slime.png",
    "僵尸": "img/chara/zombie.png",
    "七彩泉": "img/chara/spring.png",
    "不老泉": "img/chara/spring.png",
    "村落": "img/stage/village.png",
    "城镇": "img/stage/town.png",
    "城堡": "img/stage/castle.png",
    "洞窟": "img/stage/cave.png",
    "森林": "img/stage/forest.png",
    "悬崖": "img/stage/cliff.png",
    "沼泽": "img/stage/swamp.png",
    "冰原": "img/stage/iceland-1.png",
    "岩浆": "img/stage/volcano.png",
    "阿努比斯": "img/chara/boss-anubis.png",
    "暗影牧师":"img/chara/boss-darkprist.png",
    "炎魔":"img/chara/boss-firedeamon.png",
    "九头蛇":"img/chara/boss-hydra.png",
    "美杜莎":"img/chara/boss-medusa.png",
    "女王":"img/chara/boss-queen.png",
    "间谍":"img/chara/boss-spy.png",
    "古树之神":"img/chara/boss-tree.png",
    "树人小兵":"img/chara/samllTree.png",
    "恶狼":"img/chara/boss-wolf.png"
};

// function convertToImmutableGenesisCharacter() {
//     //0: IMMUTABLE;
//     const character = new Character(player.name, 0);
//     character.hp = player.fatigue;
//     character.mp = player.spirit;
//     character.str = player.power;
//     character.int = player.intelligence;
//     character.luck = player.gold;
//     character.san = player.goodness;
//     character.charm = player.agility;
//     return character;
// }

// function uploadData() {
//     const to = dappAddress;
//     const value = 0;
//     console.log("********* call smart contract \"sendTransaction\" *****************")
//
//     const func = "insertCharacter";
//     let serialized = convertToImmutableGenesisCharacter().serialize();
//     console.log("s1: " + serialized);
//     serialized = serialized.replace(/[\\\"]/g, "\\$&");
//     console.log("s2: " + serialized);
//     const args = "[\"" + serialized + "\"]";
//     console.log(args);
//
//     nebPay.call(to, value, func, args, {
//         qrcode: {
//             showQRCode: false
//         },
//         goods: {
//             name: "test",
//             desc: "test goods"
//         },
//         listener: cbCallDapp
//     });
// }

// function cbCallDapp(resp) {
//     console.log("Callback Resp: " + JSON.stringify(resp))
// }

//Data loading

function createEvents() {
    const loadfooter = [];

    loadfooter.push("Many who are first will be last, and the last first. ");
    loadfooter.push("Let there be light: and there was light.");
    loadfooter.push("Many who are first will be last, and the last first. ");
    loadfooter.push("I am the way and the truth and the life. No one comes to the Father except through me. ");
    loadfooter.push("Many who are first will be last, and the last first. ");
    loadfooter.push("Even 'sinners' love those who love them.");
    loadfooter.push("Forgive, and you will be forgiven. ");
    loadfooter.push("Do not judge, and you will not be judged.  ");
    loadfooter.push("He who has been forgiven little loves little.");
    loadfooter.push("Any kingdom divided against itself will be ruined, and a house divided against itself will fall.   ");
    loadfooter.push("Do not be conceited.");
    loadfooter.push("Wise about what is good, and innocent about what is evil.");
    loadfooter.push("Let no one deceive you with empty words.");
    loadfooter.push("A great forest is set on fire by a small spark.");
    loadfooter.push("Out of the same mouth come praise and cursing.");
    loadfooter.push("Avoid godless chatter.");

    //TODO: boss战斗，优先级：1
    //精力，金钱，力量，敏捷，智力，善恶

    //宗教相关人物：修女，牧师，僧侣，巫妖，信仰
    //战斗力：盗贼，士兵，
    //TODO: 加名字，加入一些除了人以外的事件
    //TODO: 每一关无限遇到人，加入，白天黑夜，营地，每一关要加关底boss，boss达到一定条件之后随机出现，boss是要探索的。
    //TODO: 可以一开始是？？？或者 修女 => “穿教服的女子”
    //TODO: 做任务做到一定数量就有title， 20， 30， 50， 80， 100， 200
    //TODO: 称号需要，hover， toast会有字 [DONE]
    //TODO: 数值调整，不要1:1的感觉。[DONE?]
    const allEvents = [];
    allEvents.push(createStatsChangeEvent("1", "修女", CHARA_IMGS["修女"], "冒险家，你能帮我讨伐教会附近的史莱姆吗？", "义不容辞，我遇到一定不会放过他们。", "我还有要事在身。", "1",
        EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], null, [buildBuff(BUFF.NEXT, "1-1")], null));
    allEvents.push(createStatsChangeEvent(8, "牧师", CHARA_IMGS["牧师"], "教会附近有一些僵尸，能否帮忙清理。", "要我出手的话可是费用不菲。", "就顺手帮一下吧。", "1",
        EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], null, [buildBuff(BUFF.NEXT, "8-1")], null));
    allEvents.push(createStatsChangeEvent(37, "牧师", CHARA_IMGS["牧师"], "城外有一批战争的难民我们应该去救援他们吗。", "我会保护他们。", "我们不必去。", "1",
        EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], null, [buildBuff(BUFF.NEXT, "37-1")], null));

    allEvents.push(createStatsChangeEvent(18, "僧侣", CHARA_IMGS["僧侣"], "我有一本武技的密卷，想要购买吗?", "如果不交出密卷，你只有死路一条。", "好的，我买下来了。", "1",
        EventType.NORMAL, [-1, -1], [-10, 0, 20, 0, 0, -20], [0, -10, 20, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "18-1"), buildBuff(BUFF.TITLE, "持强凌弱|你在冒险的过程中欺负了弱小！")], null));

    allEvents.push(createStatsChangeEvent(65, "密探", CHARA_IMGS["密探"], "能帮我去偷份文件吗?", "如果有钱的话。", "这种事情我可不干。", "1",
        EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, -20], [0, 0, 0, 0, 0, 30], null, [buildBuff(BUFF.NEXT, "65-1")], null));
    allEvents.push(createStatsChangeEvent("19", "僧侣", CHARA_IMGS["僧侣"], "我正在被疯狂的教会追杀，你能保护我吗？", "保护他。", "听说告发他还有奖金。", "1",
        EventType.NORMAL, [-1, -1], [-10, 0, 20, 0, 0, -20], [0, -10, 20, 0, 0, 0], null, [buildBuff(BUFF.BUFF, "19-1")], null));


    allEvents.push(createAdvancedEvent(
        new EventV2("1-1", "史莱姆", CHARA_IMGS["史莱姆"], "呜噜呜噜?##!!", null, null, null, EventType.NORMAL, "邪恶的史莱姆，接招吧！", "没想到看上去还挺可爱，就放过它吧。"),
        new StartCondition(1, "1-1", null),
        new AdvancedEventAttrs(
            () => player.power >= 20,
            null,
            [[10, 10, 1, 1, 1, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "讨伐史莱姆|你消灭了邪恶的史莱姆！")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "放弃|你放过了弱小的史莱姆。")], null]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2("slime-1", "史莱姆", CHARA_IMGS["史莱姆"], "呜噜呜噜呜噜?##!!", null, null, null, EventType.NORMAL, "邪恶的史莱姆，接招吧！", "没想到看上去还挺可爱，就放过它吧。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.power >= 20,
            null,
            [[10, 10, 1, 1, 1, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "讨伐史莱姆|你消灭了邪恶的史莱姆！"),buildBuff(BUFF.TITLE, "欺负弱小|你在冒险中欺凌了弱小的史莱姆")], [buildBuff(BUFF.MESSAGE, "惨败史莱姆|你被史莱姆轻易打倒。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "放弃|你放过了弱小的史莱姆。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("311", "史莱姆", CHARA_IMGS["史莱姆"], "你发现了一个弱小的史莱姆！", null, null, null, EventType.NORMAL, "看上去有点弱小，放过它吧", "讨伐史莱姆！"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.power >= 0,
            () => player.power >= 20,
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[10, 10, 1, 1, 1, 0],null],
            [[buildBuff(BUFF.MESSAGE, "放弃|你放过了弱小的史莱姆"), buildBuff(BUFF.BUFF, "311-1")], null],
            [[buildBuff(BUFF.MESSAGE, "讨伐史莱姆|你消灭了邪恶的史莱姆！"),buildBuff(BUFF.TITLE, "欺负弱小|你在冒险中欺凌了弱小的史莱姆")],
                [buildBuff(BUFF.MESSAGE, "惨败史莱姆|你被史莱姆轻易打倒。"),buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("311-1", "史莱姆", CHARA_IMGS["史莱姆"], "你发现了一个不怎么强的史莱姆！从它的眼中你似乎看到了求助的意味。", null, null, null, EventType.NORMAL, "帮助它。", "讨伐史莱姆！"),
        new StartCondition(1, "311-1", null),
        new AdvancedEventAttrs(
            () => player.power >= 0,
            () => player.power >= 30,
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[10, 10, 1, 1, 1, 0],null],
            [[buildBuff(BUFF.MESSAGE, "助人为乐|你选择帮助弱小的史莱姆"),buildBuff(BUFF.NEXT, "311-2")], null],
            [[buildBuff(BUFF.MESSAGE, "讨伐史莱姆|你消灭了邪恶的史莱姆！"),buildBuff(BUFF.TITLE, "欺负弱小|你在冒险中欺凌了弱小的史莱姆")], [buildBuff(BUFF.MESSAGE, "惨败史莱姆|你被史莱姆轻易打倒。"),buildBuff(BUFF.DEATH, 'dead-1')]],
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2("311-2", "僵尸", CHARA_IMGS["僵尸"], "僵尸：呜噜呜噜?##!!你发现一群僵尸正在围攻史莱姆。", null, null, null, EventType.NORMAL, "邪恶的僵尸，接招吧！", "想想还是不要插手。"),
        new StartCondition(1, "311-2", null),
        new AdvancedEventAttrs(
            () => player.agility >= 20 && player.power >= 20,
            () => player.agility >= 5 && player.power >= 10,
            [[20, 20, 5, 5, 5, 0], null],
            [[-20, 20, 5, 5, 5, 0], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "讨伐僵尸|你消灭了邪恶的僵尸！")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "放弃|放弃攻击僵尸，但是它反身咬向你的脖子，你被匆忙迎敌,最终战胜了僵尸。"),buildBuff(BUFF.TITLE, "史莱姆之友|你是史莱姆的好朋友。"),buildBuff(BUFF.BUFF, "311-3")],
                [buildBuff(BUFF.MESSAGE, "放弃|你放弃攻击僵尸，但是它反身咬向你的脖子。"), buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("311-3", "史莱姆", CHARA_IMGS["史莱姆"], "史莱姆：呜噜呜噜?##!!你发现一个巨大的史莱姆王，从它的眼中你似乎看到了友情与信任。它似乎想让你选择什么？", null, null, null, EventType.NORMAL, "左边？", "右边？"),
        new StartCondition(1, "311-3", null),
        new AdvancedEventAttrs(
            () => player.agility >= 0 && player.power >= 0,
            () => player.agility >= 0 && player.power >= 0,
            [[10, 10, 10, 10, 10, 10], null],
            [[10, 10, 10, 10, 10, 10], null],
            [[buildBuff(BUFF.MESSAGE, "石中圣剑|史莱姆引你到了一个遍布青苔的石头，上面插着一把闪光的圣剑！"),buildBuff(BUFF.NEXT, "78")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "血色魔枪|史莱姆引你到了一个洞窟，里面有着一把奇异的长枪"),buildBuff(BUFF.NEXT, "79")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("8-1", "僵尸", CHARA_IMGS["僵尸"], "呜噜呜噜?##!!", null, null, null, EventType.NORMAL, "邪恶的僵尸，接招吧！", "想想还是放过他吧。"),
        new StartCondition(1, "8-1", null),
        new AdvancedEventAttrs(
            () => player.agility >= 20 && player.power >= 20,
            () => player.agility >= 5 && player.power >= 10,
            [[20, 20, 5, 5, 5, 0], null],
            [[20, 20, 5, 5, 5, 0], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "讨伐僵尸|你消灭了邪恶的僵尸！")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "放弃|放弃攻击僵尸，但是它反身咬向你的脖子，你被匆忙迎敌。")], [buildBuff(BUFF.MESSAGE, "放弃|你放弃攻击僵尸，但是它反身咬向你的脖子。"), buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("37-1", "敌人", CHARA_IMGS["士兵"], "来者何人!", null, null, null, EventType.NORMAL, "接招吧！", "看上去似乎很强还是逃走吧。"),
        new StartCondition(1, "37-1", null),
        new AdvancedEventAttrs(
            () => player.spirit >= 30 && player.power >= 30,
            null,
            [[30, 30, 10, 10, 10, 0], null],
            [[0, 0, 0, 0, 0, -50], [0, 0, 0, 0, 0, -50]],
            [[buildBuff(BUFF.TITLE, "正义使者|你帮助了弱者，匡扶正义。")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.TITLE, "冷眼旁观|人世间的冷漠大都如此。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("18-1", "僧侣", CHARA_IMGS["僧侣"], "。。。", null, null, null, EventType.NORMAL, "受死吧。", "受死吧。"),
        new StartCondition(1, "18-1", null),
        new AdvancedEventAttrs(
            () => player.spirit >= 30 && player.power >= 50,
            null,
            [[-15, 0, 20, 0, 0, -50], null],
            [[-15, 0, 20, 0, 0, -50], null],
            [[buildBuff(BUFF.MESSAGE, "杀人了|你杀死了僧侣")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "杀人了|你杀死了僧侣")], [buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("19-1", "巫妖", CHARA_IMGS["巫妖"], "有没有见过一个僧侣?", null, null, null, EventType.NORMAL, "出卖僧侣。", "(冷静)我并没有见过。"),
        new StartCondition(1, "19-1", null),
        new AdvancedEventAttrs(
            () => player.spirit >= 0 && player.power >= 0,
            () => player.intelligence >= 50,
            [[0, 50, 0, 0, 0, -50], null],
            [null, null],
            [[buildBuff(BUFF.TITLE, "告密者|你告发了某人")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "着急的巫妖|巫妖似乎很心急，没有注意到你的谎言")], [buildBuff(BUFF.MESSAGE, "巫妖的话|不要试图去欺骗一个智慧的巫妖。说罢巫妖朝你身上下了一个凶狠的诅咒。"), buildBuff(BUFF.BUFF, "诅咒")]]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2("65-1", "法师", CHARA_IMGS["法师"], "(打盹中)", null, null, null, EventType.NORMAL, "趁机偷文件。", "想想还是不要吧。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 20,
            () => player.intelligence >= 0,
            [[0, 50, 0, 0, 0, -20], null],
            [null, null],
            [[buildBuff(BUFF.TITLE, "窃密者|你窃取了别人的东西")], [buildBuff(BUFF.NEXT, "65-2")]],
            [[buildBuff(BUFF.MESSAGE, "还是不敢|你放弃了偷窃，恍惚中你仿佛看到了法师嘴角的一丝笑意")]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("65-2", "法师", CHARA_IMGS["法师"], "没想到的法师并没有深睡。法师：住手小偷！", null, null, null, EventType.NORMAL, "什么？", "什么？"),
        new StartCondition(1, "65-1", null),
        new AdvancedEventAttrs(
            () => player.agility >= 0,
            () => player.intelligence >= 0,
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[buildBuff(BUFF.MESSAGE, "恍惚间法师已经跟你拉开了距离")], [buildBuff(BUFF.NEXT, "65-3")]],
            [[buildBuff(BUFF.MESSAGE, "恍惚间法师已经跟你拉开了距离")], [buildBuff(BUFF.NEXT, "65-3")]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("65-3", "法师", CHARA_IMGS["法师"], "法师挥舞起了法杖，在准备施法。", null, null, null, EventType.NORMAL, "赶紧打断他！", "构建个镜面魔法。"),
        new StartCondition(1, "65-3", null),
        new AdvancedEventAttrs(
            () => player.agility >= 50,
            () => player.intelligence >= 50,
            [[30, 30, 0, 0, 20, -20], null],
            [[30, 30, 0, 0, 20, -20], null],
            [[buildBuff(BUFF.MESSAGE, "攻击成功|你身手敏捷，飞快的扔出一把匕首，直接命中了法师了咽喉。"), buildBuff(BUFF.TITLE, "法师杀手|击杀了某位强力的法师")],
                [buildBuff(BUFF.MESSAGE, "攻击失败|你身手过于迟钝，法师的魔法无情的轰击在你的身上，你仿佛碎片一般随风飘去。"), buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "防御成功|你深厚的魔力构建了一个镜面魔法，反射了法师的攻击，法师如同碎片一般随风散去。"), buildBuff(BUFF.TITLE, "法师杀手|击杀了某位强力的法师")],
                [buildBuff(BUFF.MESSAGE, "防御失败|你的发力根本无法构建镜面魔法，法师的魔法无情的轰击在你的身上，你仿佛碎片一般随风飘去。"), buildBuff(BUFF.DEATH, 'dead-1')]],
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("27", "商人", CHARA_IMGS["商人"], "(打盹中)", null, null, null, EventType.NORMAL, "摸摸他身上有啥。", "想想还是不要吧。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 20,
            () => player.intelligence >= 0,
            [[0, 50, 0, 0, 0, -20], null],
            [null, null],
            [[buildBuff(BUFF.TITLE, "偷窃者|你在冒险过程中偷了别人的东西")], [buildBuff(BUFF.NEXT, "27-1")]],
            [[buildBuff(BUFF.MESSAGE, "不行。。|你放弃了偷窃")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("27-1", "商人", CHARA_IMGS["商人"], "你个小毛贼竟然敢偷我的钱！", null, null, null, EventType.NORMAL, "揍他一顿！", "乖乖送还。"),
        new StartCondition(1, "65-2", null),
        new AdvancedEventAttrs(
            () => player.power >= 30,
            () => player.intelligence >= 0,
            [[-10, 50, 0, 0, 0, -50], [-20, -50, 0, 0, 0, -50]],
            [[10, -50, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "抢夺成功|你轻易的暴打了商人一顿，并且又搜出了一堆金币。"), buildBuff(BUFF.TITLE, "欺负弱小|你在冒险中欺凌了别人")], [buildBuff(BUFF.MESSAGE, "抢夺失败|没想到商人的力量出奇的大，你被商人暴打了一顿。")]],
            [[buildBuff(BUFF.MESSAGE, "还是算了|你乖乖把钱还给了商人。")], null]
        )
    ));


    // allEvents.push(createStatsChangeEvent("1-1", "史莱姆", CHARA_IMGS["修女"], "呜噜呜噜?##!!", "邪恶的史莱姆，接招吧！", "没想到看上去还挺可爱，就放过它吧。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "1-1"), [buildBuff(BUFF.MESSAGE, "讨伐史莱姆,你消灭了邪恶的史莱姆！")],null));
    // allEvents.push(createStatsChangeEvent("8-1", "僵尸", CHARA_IMGS["修女"], "呜噜呜噜?##!!", "邪恶的僵尸，接招吧！", "僵尸这么可怜，还是放过他们把。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "8-1"), [buildBuff(BUFF.MESSAGE, "讨伐僵尸,你消灭了邪恶的僵尸！")],null));
    // allEvents.push(createStatsChangeEvent("37-1", "敌人", CHARA_IMGS["士兵"], "来者何人!", "接招吧！", "看上去似乎很强还是逃走吧。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "37-1"), [buildBuff(BUFF.MESSAGE, "讨伐敌方士兵,你保护了受侵略的难民！")],null));
    // allEvents.push(createStatsChangeEvent("18-1", "僧侣", CHARA_IMGS["僧侣"], "。。。", "受死吧。", "受死吧。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "18-1"), [buildBuff(BUFF.MESSAGE, "你杀死了僧侣")],null));
    // allEvents.push(createStatsChangeEvent("19-1", "巫妖", CHARA_IMGS["巫妖"], "有没有见过一个僧侣", "出卖僧侣。", "我并没有见过。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 0, 0, 0, 0, -50], [-10, 10, 10, 10, 10, 20], buildBuff(BUFF.BUFF, "19-1"),null,[buildBuff(BUFF.TITLE, "守口如瓶")]));
    // allEvents.push(createStatsChangeEvent("65-1", "法师", CHARA_IMGS["法师"], "(打盹中)", "趁机头文件。", "想想还是不要吧。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, -50], [10, 0, 0, 0, 0, 0], buildBuff(BUFF.BUFF, "65-1"),null,null));

    allEvents.push(createStatsChangeEvent(2, "修女", CHARA_IMGS["修女"], "你愿意帮忙捐助一下教会嘛？", "乐于奉献。", "我手边有点紧.", "1", EventType.NORMAL, [-1, -1], [10, -10, 0, 0, 0, 10], [5, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(3, "修女", CHARA_IMGS["修女"], "教会的经书隐藏着智慧。", "能借我阅读一下嘛？", "我还是想休息一下。", "1", EventType.NORMAL, [-1, -1], [0, 0, 10, 10, 10, 0], [-10, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(4, "修女", CHARA_IMGS["修女"], "我很后悔我之前做过的错事，能否帮我去跟骑士道歉？", "我可以帮助你，愿你能得到解脱。", "如果做错的事情都可以重来，那么经历将毫无意义！", "3",
        EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 20], [-10, 0, 0, 0, 0, -20], null, [buildBuff(BUFF.BUFF, "4")], null));

    //TODO: XXX? 加入title
    allEvents.push(createStatsChangeEvent("4-1", "黑骑士", CHARA_IMGS["黑骑士"], "孤独的月光下一名骑士正在沉思。", "有人很后悔她做过的事情，想拖我来道歉。", "。。。", "1", EventType.NORMAL,
        [-1, -1], [-10, 0, 0, 0, 0, 20], [-10, 0, 0, 0, 0, -20], buildBuff(BUFF.BUFF, "4"), [buildBuff(BUFF.NEXT, "4-2")]));
    allEvents.push(createStatsChangeEvent("4-2", "黑骑士", CHARA_IMGS["黑骑士"], "我早已忘记XXX了。", "嗯。。。", "嗯。。。", "1", EventType.SUBSEQUENT, [-1, -1], [-10, 0, 0, 0, 0, 20], [-10, 0, 0, 0, 0, -20]));

    allEvents.push(createStatsChangeEvent(5, "修女", CHARA_IMGS["修女"], "听闻东方有种神奇的草药，我这里有它标示的地图，现在免费赠送给您。", "修女的话似乎可信，值得尝试。", "此去不知归途，还是休息休息吧。", "2",
        EventType.NORMAL, [-1, -1], [-20, 0, 0, 0, 0, 0], [10, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.BUFF, "5-1")], null));
    //TODO: 加入草药任务 需要解锁 需要比较敏捷 图片TODO
    // allEvents.push(createStatsChangeEvent("5-1", "修女", CHARA_IMGS["修女"], "你在孤零零的悬崖上看到一株特别的草药。", "这就是修女说的草药吗？", "感觉上去采摘有点危险。", "3", EventType.NORMAL,
    //     [-1, -1], [-10, 0, 0, 0, 0, 20], [-10, 0, 0, 0, 0, -20]));

    allEvents.push(createAdvancedEvent(
        new EventV2("5-1", "修女", CHARA_IMGS["修女"], "你在孤零零的悬崖上看到一株特别的草药。", null, null, null, EventType.NORMAL, "这就是修女说的草药吗？", "感觉上去采摘有点危险。"),
        new StartCondition(1, "5-1", null),
        new AdvancedEventAttrs(
            () => player.agility >= 30 ,
            () => player.agility >= 0 ,
            [[-10, 10, 0, 0, 0, 20], buildBuff(BUFF.DEATH, 'dead-1')],
            [[-10, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.TITLE, "乐于助人|你热心的帮助身边的人。"),buildBuff(BUFF.MESSAGE, "修女的草药|你帮助修女获得了一株神奇的草药。")], buildBuff(BUFF.MESSAGE, "摔落悬崖|你为了采摘草药，但不够敏捷，一不小心跌落了悬崖。")],
            [[buildBuff(BUFF.TITLE, "小命要紧|你在危险的地方谨慎行事。")], null]
        )
    ));

    allEvents.push(createStatsChangeEvent(6, "修女", CHARA_IMGS["修女"], "西边悬崖上有把勇者之剑，快去拿回来吧～", "赶紧去取一下。", "悬崖上真的只有宝剑嘛？", "5", EventType.NORMAL,
        [600, 500], [0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.NEXT, "600"), buildBuff(BUFF.NEXT, "500")));
    //TODO: 和stage悬崖挂钩，悬崖上真的只有宝剑嘛？ 修女：我不清楚，不过数十年间，去悬崖的冒险者都没有归还。
    allEvents.push(createStatsChangeEvent(205, "修女", CHARA_IMGS["修女"], "我不清楚，不过数十年间，去悬崖的冒险者都没有归还。", "看来还要谨慎为上。", "看来还要谨慎为上。", "5", EventType.NORMAL, [600, 500], [0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10]));

    allEvents.push(createStatsChangeEvent(7, "牧师", CHARA_IMGS["牧师"], "年轻的冒险者，来吃些免费的食物吧。", "正有此意。", "不劳者不食.", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 0, -10], [-10, 0, 0, 0, 0, 10]));
    // allEvents.push(createStatsChangeEvent(8, "牧师", CHARA_IMGS["牧师"], "教会附近有一些僵尸，能否帮忙清理。", "要我出手的话可是费用不菲。", "就顺手帮一下吧。", "1", EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, -10], [-10, 0, 0, 0, 0, 10]));
    //TODO: 加入僵尸 要打 205
    // allEvents.push(createStatsChangeEvent(206, "僵尸", CHARA_IMGS["僵尸"], "呜噜呜噜?##!!", "邪恶的僵尸，接招吧！", "僵尸这么可怜，还是放过他们把。", "1", EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10]));

    // allEvents.push(createStatsChangeEvent(37, "牧师", CHARA_IMGS["牧师"], "城外有一批战争的难民我们应该去救援他们吗？", "我会保护他们。", "我们不必去。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10]));
    //TODO: 太弱就挂
    // allEvents.push(createStatsChangeEvent(207, "敌人", CHARA_IMGS["士兵"], "来者何人？", "接招吧。", "看上去似乎很强还是逃走吧。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10]));

    allEvents.push(createStatsChangeEvent(66, "医生", CHARA_IMGS["医生"], "能否借我些金钱去帮助我的病人？", "我又不是慈善家。", "我只有这些了，代表我的心意。", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 0, -10], [0, -10, 0, 0, 0, 10]));
    //分叉
    allEvents.push(createStatsChangeEvent(11, "医生", CHARA_IMGS["医生"], "能否帮我寻找一些草药？", "如果报酬不菲，那自然可以。", "我乐于前往。", "1", EventType.NORMAL, [-1, -1], [-10, 10, 0, 0, 0, 10], [-10, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(12, "医生", CHARA_IMGS["医生"], "需要治疗下吗?", "我刚好需要休息。", "不必了。", "1", EventType.NORMAL, [-1, -1], [10, -20, 10, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    //special
    allEvents.push(createStatsChangeEvent(14, "医生", CHARA_IMGS["医生"], "交不起钱的穷人，能否帮我驱赶一下。", "报酬足够的话可以的。", "不能违背自己的良心啊。", "3", EventType.NORMAL, [608, -1], [0, 20, 0, 0, 0, -10], [10, 0, 0, 0, 0, 10]));

    //与连续事件重复
    //allEvents.push(createStatsChangeEvent(15, "医生", CHARA_IMGS["医生"], "医者仁心，王子病重而亡。王却因此处死我，能否帮我复仇。", "公正与怜悯，我会帮助你！", "你将带着怨恨长眠于此。。", "1", EventType.NORMAL, [615, -1], [-10, 0, 10, 10, 10, 20], [10, 0, 0, 0, 0, -20]));
    //  allEvents.push(createStatsChangeEvent(16, "僧侣", CHARA_IMGS["僧侣"], "需要学习下武技嘛?", "当然愿意。", "还不如休息一下。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 0, 0, 0], [10, 0, 0, 0, 0, 0]));


    allEvents.push(createStatsChangeEvent("16", "僧侣", CHARA_IMGS["僧侣"], "需要学习下武技嘛？", "当然愿意?。", "还不如休息一下。", "1", EventType.NORMAL,
        [-1, -1], [-10, 0, 20, 0, 0, 0], [10, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "僧侣的神秘武技|你学习了僧侣精湛的武艺。")],
        null));


    allEvents.push(createStatsChangeEvent(17, "僧侣", CHARA_IMGS["僧侣"], "年轻的冒险家需要治疗吗?", "感谢你的帮助。", "我并不信任你。", "1", EventType.NORMAL, [-1, -1], [20, 0, 0, 0, 0, 0], [-10, 0, 0, 0, 0, 0]));

    // allEvents.push(createStatsChangeEvent(18, "僧侣", CHARA_IMGS["僧侣"], "我有一本武技的密卷，想要购买吗?", "如果不交出密卷，你只有死路一条。", "好的，我买下来了。", "1", EventType.NORMAL, [607, -1], [-10, 0, 20, 0, 0, -20], [0, -10, 20, 0, 0, 0]));
    //TODO: 跟僧侣比较属性 208
    // allEvents.push(createStatsChangeEvent(208, "僧侣", CHARA_IMGS["僧侣"], "。。。", "受死吧。", "受死吧", "1", EventType.NORMAL, [-1, -1], [0, 10, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10]));

    // allEvents.push(createStatsChangeEvent(19, "僧侣", CHARA_IMGS["僧侣"], "我正在被疯狂的教会追杀，你能保护我吗？", "保护他。", "听说告发他还有奖金。", "1", EventType.NORMAL, [615, -1], [0, 0, 0, 0, 0, 20], [0, 20, 0, 0, 0, -20]));
    //TODO: 和巫妖互动（巫妖追杀僧侣），告发就不会触发巫妖事件。 巫妖211

    //TODO: 一开始的名字可以是？？？骑士
    allEvents.push(createStatsChangeEvent(20, "奇怪的白骑士", CHARA_IMGS["白骑士"], "每一个人都是勇士，打败敌人最好的方法就是让自己变得更强。", "我想跟您学习武技。", "你在说什么？？？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 0, 0, 0], [-10, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(21, "奇怪的白骑士", CHARA_IMGS["白骑士"], "骑士也许会妥协，但是绝不会放弃执行正义。", "你说的很对。", "似乎过于迂腐。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10]));
    allEvents.push(createStatsChangeEvent(22, "奇怪的白骑士", CHARA_IMGS["白骑士"], "在童话里，王子和公主会很幸福很幸福的永远生活在一起，他们看不见的是骑士的守护。", "这就是骑士的指责。", "似乎骑士的压力过于重大。", "1", EventType.NORMAL, [-1, -1], [10, 0, 10, 10, 10, 10], [-10, 0, -10, -10, -10, -10]));
    allEvents.push(createStatsChangeEvent(39, "奇怪的白骑士", CHARA_IMGS["白骑士"], "荣誉的背后，是千百倍的心酸。", "荣耀，与你同在。", "有人考虑过骑士的感受吗。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, 10], [-10, 0, 10, 10, 10, -10]));
    allEvents.push(createStatsChangeEvent(40, "奇怪的白骑士", CHARA_IMGS["白骑士"], "世上总有一些人值得用一生去守护。", "我也有想要守护的人。", "我先要保护我自己。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, 10], [-10, 0, 0, 0, 0, -10]));
    allEvents.push(createStatsChangeEvent(74, "奇怪的白骑士", CHARA_IMGS["白骑士"], "昨夜，美酒入喉，我心欢畅。", "今朝，酒冷香落，徒留荒凉。", "今朝，酒盏花枝，伊人依旧。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    allEvents.push(createStatsChangeEvent(75, "奇怪的白骑士", CHARA_IMGS["白骑士"], "幸福感这种东西，会沉在悲哀的河底，隐隐发光，仿佛砂金一般。", "不是应该更加珍惜吗？", "终究是沉没在悲伤的河底吗？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));

    allEvents.push(createStatsChangeEvent(301, "黑骑士", CHARA_IMGS["黑骑士"], "曾经的天真，帮助愚蠢的我长大。", "这不是你堕落的理由。", "也许他是个真正的骑士。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [-10, 0, 0, 0, 0, -10]));
    //TODO: 这段再考虑一下
    allEvents.push(createStatsChangeEvent(302, "黑骑士", CHARA_IMGS["黑骑士"], "大众总喜欢将真相扭曲到自己可以接受的程度，这就是一种充满惰性的思维方式。", "这个人思维很独特，我想跟他学习一下。", "我并不认为他很强大。", "1", EventType.NORMAL, [-1, 610], [0, 0, 10, 0, 0, -10], [0, 0, 0, 0, 0, 0]));
    //TODO: 和关底有互动 209
    allEvents.push(createStatsChangeEvent(303, "黑骑士", CHARA_IMGS["黑骑士"], "在现实里，王子和公主可能不会在一起，因为他们都以为自己是骑士，只会默默的等待。", "非常悲哀的存在呢。", "那么王子和公主都是谁呢？", "1", EventType.NORMAL, [-1, -1], [10, 0, 10, 10, 10, 10], [-10, 0, -10, -10, -10, -10]));
    //TODO: 和修女互动 title 这个我没想好怎么互动

    allEvents.push(createStatsChangeEvent(23, "黑骑士", CHARA_IMGS["黑骑士"], "有人需要真皮，所以才有了猎人去虐杀动物， 最终被捕的是猎人，那么披着真皮的人呢？", "这就是堕落的借口吗？", "也许错的不是他。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 0, 10], [10, 0, 10, 10, 10, -10]));
    //TODO: 和猎人互动 209
    allEvents.push(createStatsChangeEvent(209, "猎人", CHARA_IMGS["猎人"], "没想到黑骑士会帮我出头？", "他是一个正义的骑士。", "他只是愤世嫉俗罢了。", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 0, 10], [10, 0, 10, 10, 10, -10]));

    allEvents.push(createStatsChangeEvent(41, "黑骑士", CHARA_IMGS["黑骑士"], "手中有剑，便提剑前行；手中无剑，便忘剑前进。", "言之有理。", "手无寸铁该如何战斗。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(42, "黑骑士", CHARA_IMGS["黑骑士"], "伟大的代价就是责任。", "我想听听。", "没空理会。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 0, -10], [0, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(64, "黑骑士", CHARA_IMGS["黑骑士"], "我将会为公主的幸福之路献上我的尸骸。", "骑士最终的结局就是被公主杀死。", "你需要更理智的看待爱情。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, -10], [-10, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(68, "黑骑士", CHARA_IMGS["黑骑士"], "若人生只如初见 倾一世也必定恪然执守。", "人生没有重来的机会。", "你是后悔你的选择吗？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 0, 10], [-10, 0, 10, 10, 0, -10]));

    // allEvents.push(createStatsChangeEvent(24, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "朋友，你见到过大海吗？", "大海是什么。", "我并不想去做无谓的冒险。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createAdvancedEvent(
        new EventV2("24", "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "朋友，你见到过大海吗？", null, null, null, EventType.NORMAL, "大海是什么，我想去看看？", "我并不想去做无谓的冒险。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.power >= 30 ,
            () => player.agility >= 0 ,
            [[-10, 10, 10, 10, 10, 20], buildBuff(BUFF.DEATH, 'dead-1')],
            [[-10, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.TITLE, "星辰大海|你在璀璨的星空下见到了此生难忘的美景。"),buildBuff(BUFF.MESSAGE, "海浪滔滔|海浪一浪接着一浪，你奋力挣扎，摆脱了危险。")], [buildBuff(BUFF.MESSAGE, "海浪滔滔|海浪一浪接着一浪，你因精疲力尽，淹没在了海里。")]],
            [[buildBuff(BUFF.TITLE, "小命要紧|你在危险的地方谨慎行事。")], null]
        )
    ));


    allEvents.push(createStatsChangeEvent(25, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "人生的轨迹纵横交错，就是世界上最美的一幅图。", "交错的命运是为了什么呢？", "我对你没有任何所求。", "3", EventType.NORMAL, [620, 606], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent(58, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "是否要跟我学习下偷窃技术？", "我正好想跟您学习？", "并不是很感兴趣？", "1", EventType.NORMAL, [-1, -1], [-10, -10, 0, 10, 0, 0], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent(60, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "是否要跟我学习下法术？", "我正好想跟您学习？", "并不是很感兴趣？", "1", EventType.NORMAL, [-1, -1], [-10, -10, 0, 0, 10, 0], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent(61, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "是否要跟我学习下战斗技巧？", "我正好想跟您学习？", "并不是很感兴趣？", "1", EventType.NORMAL, [-1, -1], [-10, -10, 10, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createMajorRandomEvent(102, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "长路漫漫，是选择前进还是后退呢？", "朝前走吧。", "走回头路也不错。", "1", EventType.RANDOM, [-1, -1]));

    // allEvents.push(createStatsChangeEvent(26, "商人", CHARA_IMGS["商人"], "我这里正需要人手，要不要来打零工换些金钱。", "我正有此意。", "没什么时间。", "1", EventType.NORMAL, [-1, -1], [-10, 10, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent("26-1", "商人", CHARA_IMGS["商人"], "我这里正需要人手，要不要来打零工换些金钱?", "我正有此意！。", "没什么时间。", "1", EventType.NORMAL,
        [-1, -1], [-10, 10, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "辛苦工作|你辛苦的帮商人打工，老板如约的付给你了钱。"), buildBuff(BUFF.COMPLETE, "50")],
        null));


    allEvents.push(createStatsChangeEvent("26-2", "商人", CHARA_IMGS["商人"], "要不要来打工赚点钱?", "刚好手边有点紧！。", "没时间浪费精力了。", "1", EventType.NORMAL,
        [-1, -1], [-10, 20, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "辛苦工作|你辛苦的帮商人打工，老板非常高兴，给你了不菲的回报。"), buildBuff(BUFF.COMPLETE, "50")],
        null));

    allEvents.push(createStatsChangeEvent("26-3", "商人", CHARA_IMGS["商人"], "要不要来打工赚点钱?", "刚好手边有点紧！。", "没时间浪费精力了。", "1", EventType.NORMAL,
        [-1, -1], [-10, 5, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "辛苦工作|你辛苦的帮商人打工，没想到小气的老板竟然克扣了你的工资。"), buildBuff(BUFF.COMPLETE, "50")],
        null));

    // allEvents.push(createStatsChangeEvent(27, "商人", CHARA_IMGS["商人"], "（打盹）", "摸摸看他身上有啥？", "还是不打扰他了。", "1", EventType.NORMAL, [-1, -1], [-10, 10, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10]));
    //TODO: 有几率跟他干 几率打  打输了死
    // allEvents.push(createStatsChangeEvent(27, "法师", CHARA_IMGS["法师"], "(打盹中)", "摸摸看他身上有啥。", "还是不打扰他了。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 10, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10], buildBuff(BUFF.BUFF, "65-1"),null,null));
    // allEvents.push(createStatsChangeEvent("27-1", "商人", CHARA_IMGS["商人"], "该死的小偷别跑", "揍他一顿。", "乖乖退还。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [-10, -20, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "65-1"), [buildBuff(BUFF.MESSAGE, "你暴揍了商人一顿！")],null));


    //TODO: 商人有几率卖过关的东西（这里有什么？）
    allEvents.push(createStatsChangeEvent("44", "商人", CHARA_IMGS["商人"], "我这里有两个上古的圣物，你选一个吧。", "腐朽的巨剑。", "泛黄的魔法书。", "1", EventType.NORMAL,
        [-1, -1], [0, 0, 10, 0, 0, 0], [0, 0, 0, 0, 10, 0], null,
        [buildBuff(BUFF.BUFF, "腐朽的巨剑"), buildBuff(BUFF.MESSAGE, "获得物品|腐朽的巨剑"), buildBuff(BUFF.COMPLETE, "44")],
        [buildBuff(BUFF.BUFF, "泛黄的魔法书"), buildBuff(BUFF.MESSAGE, "获得物品|泛黄的魔法书"), buildBuff(BUFF.COMPLETE, "44")]));

    allEvents.push(createStatsChangeEvent(28, "巫妖", CHARA_IMGS["巫妖"], "亡灵国度是容不得活人的。", "人类世界就容得下活人吗？", "这不过是亡灵虚假的谎言。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10]));
    //TODO: pending
    allEvents.push(createStatsChangeEvent(29, "巫妖", CHARA_IMGS["巫妖"], "年份即智慧，什么阴谋、背叛、欺骗没有见识过。", "我想向您请教魔法的知识", "但是这不是你背叛的借口。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 20, 0], [0, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(30, "巫妖", CHARA_IMGS["巫妖"], "会去尊重崇尚献出生命的人，都是与你无关紧要的人。真正在乎你的人，只希望你好好的活着。", "为了守护所爱之人，有些牺牲是必须的 ", "我会保护好自己。", "1", EventType.NORMAL, [-1, -1], [10, 0, 10, 10, 10, 10], [10, 0, 10, 10, 10, -10]));
    allEvents.push(createStatsChangeEvent(63, "巫妖", CHARA_IMGS["巫妖"], "转瞬百年，诸事无常。", "巫妖不会懂得生命的意义", "我也想获得长生", "1", EventType.NORMAL, [-1, -1], [0, 0, 10, 10, 10, 10], [0, 0, 10, 10, 10, -10]));
    allEvents.push(createStatsChangeEvent(67, "巫妖", CHARA_IMGS["巫妖"], " 就是因为自己非常怕死，所以才会对别人的死亡流下眼泪。", "巫妖也会流眼泪？", "邪恶的巫妖从不流眼泪。", "1", EventType.NORMAL, [-1, -1], [10, 0, 10, 10, 10, -10], [10, 0, 10, 10, 10, 10]));

    //TODO: title 与僧侣互动 正义使者
    allEvents.push(createStatsChangeEvent(211, "巫妖", CHARA_IMGS["巫妖"], "有没有见过一个僧侣。", "出卖僧侣。", "我并没有见过。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10]));

    allEvents.push(createStatsChangeEvent(31, "盗贼", CHARA_IMGS["盗贼"], "要不要跟我学学身手。", "我正好想变的更加灵活。", "偷窃的本事还是算了。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 20, 0, 0], [0, 0, 0, 0, 0, 10]));
    // allEvents.push(createStatsChangeEvent(29, "盗贼", CHARA_IMGS["盗贼"], "跟我一起去历练吧。", "刚好出去历练一下", "成为一个盗贼并没有很有趣。", "1", EventType.NORMAL, [-1, -1], [10, 10, 10, 10, 10, 0], [0, 0, 0, 0, 0, 10]));
    //TODO: 属性不够历练就挂

    allEvents.push(createAdvancedEvent(
        new EventV2(29, "盗贼", CHARA_IMGS["盗贼"], "跟我一起去历练吧。", null, null, null, EventType.NORMAL, "刚好出去历练一下", "成为一个盗贼并没有很有趣。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 50 && player.power >= 50,
            null,
            [[10, 10, 10, 10, 10, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.TITLE, "江湖侠盗|成功通过了盗贼试炼")], [buildBuff(BUFF.DEATH, "600")]],
            [null, null]
        )
    ));




    allEvents.push(createStatsChangeEvent(30, "法师", CHARA_IMGS["法师"], "要么安于现状，要么改变现状，改变的总是要付出。", "我愿意跟你修炼。", "要钱还是算了吧。", "1", EventType.NORMAL, [-1, -1], [-10, -10, 0, 0, 30, 0], [0, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(31, "法师", CHARA_IMGS["法师"], "听说过法师塔吗？", "我想进入学习。", "我会保护好自己。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 30, 0, 0], [0, 0, 0, 0, 0, -10]));
    allEvents.push(createAdvancedEvent(
        new EventV2(31, "法师", CHARA_IMGS["法师"], "听说过法师塔吗。", null, null, null, EventType.NORMAL, "我想进入学习", "听起来有点危险。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.intelligence >= 50 && player.spirit >= 50,
            null,
            [[10, 10, 0, 0, 30, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.TITLE, "法海无边|你通过了法师塔的试炼")], [buildBuff(BUFF.MESSAGE, "法术陷阱|你在试炼中掉进了法术陷阱中，你贫瘠的法力瞬间就被抽干，瘫倒在深坑中。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [null, null]
        )
    ));

    //TODO: 不够就挂了
    allEvents.push(createStatsChangeEvent(32, "法师", CHARA_IMGS["法师"], "知识才是一个魔法师最虔诚的信仰。", "知识也是我的信仰。", "我并不信仰知识。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 10, 10], [0, 0, 0, 0, -10, -10]));
    // allEvents.push(createStatsChangeEvent(45, "法师", CHARA_IMGS["法师"], "我这里有两个法器暂时不用，送你一个吧", "发光的魔法球。", "充满魔力的法杖。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 10, 0], [-10, 0, 0, 0, 20, 0]));
    allEvents.push(createAdvancedEvent(
        new EventV2(45, "法师", CHARA_IMGS["法师"], "我这里有两个法器暂时不用，送你一个吧。", null, null, null, EventType.NORMAL, "发光的魔法球。", "充满魔力的法杖。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 0 && player.power >= 0,
            () => player.agility >= 0 && player.power >= 0,
            [[-10, 0, 0, 0, 10, 0], null],
            [[-10, 0, 0, 0, 20, 0], null],
            [[buildBuff(BUFF.MESSAGE, "魔法球|你获得一个发光的魔法球。")], null],
            [[buildBuff(BUFF.MESSAGE, "法杖|你获得一个充满魔力的法杖。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("310-1", "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "想要来玩一把骰子嘛？", null, null, null, EventType.NORMAL, "听起来很有意思。", "想想还是不要玩了。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => Math.floor(Math.random()*10+1) >= 5 ,
            () => player.agility >= 0 && player.power >= 0,
            [[0, 10, 0, 0, 10, 0], [0, -10, 0, 0, 10, 0]],
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[buildBuff(BUFF.MESSAGE, "骰子|骰子飞快的旋转着，最后平稳下来你的点数轻易的赢取了赌局。")], [buildBuff(BUFF.MESSAGE, "骰子|骰子飞快的旋转着，最后平稳下来你的点数差点赢了赌局。")]],
            [[buildBuff(BUFF.MESSAGE, "克己|你克制了自己赌博的欲望。")], null]
        )
    ));
    //TODO: 和过关有关
    allEvents.push(createStatsChangeEvent(103, "法师", CHARA_IMGS["法师"], "想要金钱，还是想要智慧呢？", "金钱。", "智慧。", "1", EventType.NORMAL, [-1, -1], [-20, 20, 0, 0, 0, 0], [-20, 0, 0, 0, 20, 0]));
    allEvents.push(createStatsChangeEvent(106, "法师", CHARA_IMGS["法师"], "我的法杖掉了，帮我去买一个吧？", "懒得做。", "帮他买一下把。", "1", EventType.NORMAL, [-1, -1], [5, 0, 0, 0, 0, 0], [-10, 0, 0, 0, 10, 10]));

    allEvents.push(createStatsChangeEvent(33, "野鬼", CHARA_IMGS["野鬼"], "失去的，就是失去的，时间什么都不会冲淡，只会让自己对过去的事情变得麻木。", "还是不要打扰这个孤独的灵魂。", "鬼魂似乎想要传达什么。", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 0, 0], [10, 0, 0, 0, 0, 10]));
    allEvents.push(createMajorRandomEvent(118, "野鬼", CHARA_IMGS["野鬼"], "前方是条死路，回去吧冒险家？", "我才不信你的鬼话连篇。", "适当的退后也是智慧的表现。", "1", EventType.RANDOM, [-1, -1]));
    //TODO:　随个数，测试一下random事件
    allEvents.push(createAdvancedEvent(
        new EventV2("118-1", "野鬼", CHARA_IMGS["野鬼"], "我这里有个小任务，需要来挑战一下嘛？", null, null, null, EventType.NORMAL, "刚好出去历练一下", "还是保守点。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 0 && player.power >= 0,
            null,
            [[5, 0, 0, 0, 0, 10], null],
            [[5, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.TITLE, "鬼影|你窥视了鬼魂的阴影"),buildBuff(BUFF.NEXT, "118-2")], null],
            [[buildBuff(BUFF.TITLE, "小命要紧|你在危险的地方谨慎行事。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("118-2", "野鬼", CHARA_IMGS["野鬼"], "无数的鬼魂疯狂的涌现出来，向你冲来。", null, null, null, EventType.NORMAL, "赶紧躲避。", "赶紧施法。"),
        new StartCondition(1, "118-2", null),
        new AdvancedEventAttrs(
            () => player.agility >= 80,
            () => player.intelligence >= 160,
            [[10, 10, 10, 10, 10, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "身手矫捷|你在鬼魂合围之前就逃出了包围圈，并且顺手拿走了地上的宝物。"),buildBuff(BUFF.TITLE, "逃出生天|你从危险中机智的逃脱了。")], [buildBuff(BUFF.MESSAGE, "孤魂|你被重重鬼影包围，迷失在了山谷中。")]],
            [[buildBuff(BUFF.MESSAGE, "法力高深|你用法力强行驱散了鬼魂，并且拿走了地上的宝物。"),buildBuff(BUFF.TITLE, "杀出重围|你从重重包围中杀出一条血路。")], [buildBuff(BUFF.MESSAGE, "孤魂|你被重重鬼影包围，迷失在了山谷中。")]]
        )
    ));

    allEvents.push(createStatsChangeEvent(34, "猎人", CHARA_IMGS["猎人"], "跟我一起去打猎吧。", "去练练身手也不错。", "确实想打猎换点钱。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 10, 0, 0], [-10, 20, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(43, "猎人", CHARA_IMGS["猎人"], "需要跟我学习猎人技巧吗。", "听起来不错。", "要钱就算了。", "1", EventType.NORMAL, [-1, -1], [-10, -10, 0, 30, 10, 0], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent("43", "猎人", CHARA_IMGS["猎人"], "需要跟我学习猎人技巧吗？", "听起来不错?。", "要钱就算了。", "1", EventType.NORMAL,
        [-1, -1], [-10, -10, 0, 30, 10, 0], [0, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "猎人的战斗技巧|你学习了猎人高超的战斗方法")],
        null));

    //new
    allEvents.push(createStatsChangeEvent(35, "密探", CHARA_IMGS["密探"], "想要钱嘛，告诉我点消息？", "告诉他人的秘密。", "此等不义之举不能参与。", "1", EventType.NORMAL, [-1, -1], [0, 10, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10]));
    //TODO: 告诉谁的秘密。
    // allEvents.push(createStatsChangeEvent(65, "密探", CHARA_IMGS["密探"], "能帮我去偷份文件吗？。", "如果有钱的话。", "这种事情我可不干。", "1", EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, -10], [0, 0, 0, 0, 0, 10]));
    //TODO: 跟人干，敏捷 （法师正在打盹，要窃取法师的文件吗？）

    // allEvents.push(createStatsChangeEvent(38, "士兵", CHARA_IMGS["士兵"], "我是一名现役的军官，是否需要我传授你一些武艺？？", "我想听听。", "我没有多余的金币。", "1", EventType.NORMAL, [-1, -1], [-10, -10, 10, 10, 0, 1], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent("38", "士兵", CHARA_IMGS["士兵"], "我是一名现役的军官，是否需要我传授你一些武艺？", "我想听听?。", "我没有多余的金币。", "1", EventType.NORMAL,
        [-1, -1], [-10, -10, 10, 10, 0, 10], [0, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "士兵的武艺|你跟士兵学习了战斗方法，但是大多是入门的武艺。")],
        null));


    allEvents.push(createStatsChangeEvent(46, "酒馆老板", CHARA_IMGS["酒馆老板"], "需要休息吗？", "正有此意。", "手边没钱。", "1", EventType.NORMAL, [-1, -1], [30, -15, 0, 0, 0, 0], [-5, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(47, "酒馆老板", CHARA_IMGS["酒馆老板"], "来吃顿好的吧。", "正有此意。", "手边没钱。", "1", EventType.NORMAL, [-1, -1], [20, -10, 0, 0, 0, 0], [-5, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(48, "酒馆老板", CHARA_IMGS["酒馆老板"], "要不要来喝一杯。", "正有此意。", "手边没钱。", "1", EventType.NORMAL, [-1, -1], [10, -10, 0, 0, 0, 0], [-5, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(49, "酒馆老板", CHARA_IMGS["酒馆老板"], "要不要来打工赚点钱。", "刚好手边有点紧。", "没时间浪费精力了。", "1", EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent("49-1", "酒馆老板", CHARA_IMGS["酒馆老板"], "要不要来打工赚点钱?", "刚好手边有点紧！。", "没时间浪费精力了。", "1", EventType.NORMAL,
        [-1, -1], [-10, 20, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "辛苦工作|你辛苦的帮酒馆老板打工，老板如约的付给你了钱。"), buildBuff(BUFF.COMPLETE, "50")],
        null));


    allEvents.push(createStatsChangeEvent("49-2", "酒馆老板", CHARA_IMGS["酒馆老板"], "要不要来打工赚点钱?", "刚好手边有点紧！。", "没时间浪费精力了。", "1", EventType.NORMAL,
        [-1, -1], [-10, 30, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "辛苦工作|你辛苦的帮酒馆老板打工，老板非常高兴，给你了不菲的回报。"), buildBuff(BUFF.COMPLETE, "50")],
        null));

    allEvents.push(createStatsChangeEvent("49-3", "酒馆老板", CHARA_IMGS["酒馆老板"], "要不要来打工赚点钱?", "刚好手边有点紧！。", "没时间浪费精力了。", "1", EventType.NORMAL,
        [-1, -1], [-10, 10, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "辛苦工作|你辛苦的帮酒馆老板打工，没想到小气的老板竟然克扣了你的工资。"), buildBuff(BUFF.COMPLETE, "50")],
        null));

    //TODO: 和过关有关
    allEvents.push(createStatsChangeEvent("50", "酒馆老板", CHARA_IMGS["酒馆老板"], "上次旅行的法师落下了个法杖，你需要吗？", "看起来很不错，买了！。", "刚好手边有点紧。", "1", EventType.NORMAL,
        [-1, -1], [0, -10, 0, 0, 10, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.BUFF, "法师的长杖"), buildBuff(BUFF.MESSAGE, "获得物品|法师的长杖"), buildBuff(BUFF.COMPLETE, "50")],
        null));
    //TODO: 和过关有关
    allEvents.push(createStatsChangeEvent("51", "酒馆老板", CHARA_IMGS["酒馆老板"], "上次旅行的战士落下了个巨剑，你需要吗？", "看起来很不错，买了！。", "刚好手边有点紧。", "1", EventType.NORMAL,
        [-1, -1], [0, -10, 0, 0, 10, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.BUFF, "战士的巨剑"), buildBuff(BUFF.MESSAGE, "获得物品|战士的巨剑"), buildBuff(BUFF.COMPLETE, "51")],
        null));
    //TODO: 和过关有关
    allEvents.push(createStatsChangeEvent("52", "酒馆老板", CHARA_IMGS["酒馆老板"], "上次旅行的盗贼落下了个匕首，你需要吗？", "看起来很不错，买了！。", "刚好手边有点紧。", "1", EventType.NORMAL,
        [-1, -1], [0, -10, 0, 0, 10, 0], [5, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.BUFF, "盗贼的匕首"), buildBuff(BUFF.MESSAGE, "获得物品|盗贼的匕首"), buildBuff(BUFF.COMPLETE, "52")],
        null));

    // allEvents.push(createStatsChangeEvent(50, "酒馆老板", CHARA_IMGS["酒馆老板"], "上次旅行的法师落下了个法杖，你需要吗？", "看起来很不错，买了！", "刚好手边有点紧。", "1", EventType.NORMAL, [-1, -1], [0, -10, 0, 0, 10, 0], [5, 0, 0, 0, 0, 0]));
    //TODO: 和过关有关
    // allEvents.push(createStatsChangeEvent(51, "酒馆老板", CHARA_IMGS["酒馆老板"], "上次旅行的战士落下了个巨剑，你需要吗？", "看起来很不错，买了！", "刚好手边有点紧。", "1", EventType.NORMAL, [-1, -1], [0, -10, 10, 0, 0, 0], [5, 0, 0, 0, 0, 0]));
    //TODO: 和过关有关
    // allEvents.push(createStatsChangeEvent(52, "酒馆老板", CHARA_IMGS["酒馆老板"], "上次旅行的盗贼落下了个匕首，你需要吗？", "看起来很不错，买了！", "刚好手边有点紧。", "1", EventType.NORMAL, [-1, -1], [0, -10, 0, 10, 0, 0], [5, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent(53, "亚当", CHARA_IMGS["亚当"], "传闻黑骑士因公主而堕落。", "原来如此，但是公主是谁？", "可怜的骑士。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [-10, 0, 0, 0, 0, -10]));
    allEvents.push(createStatsChangeEvent(54, "亚当", CHARA_IMGS["亚当"], "据说北方的洞窟里有一只魔龙", "我也听说类似的传说", "让我来想想如何打败它。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 0], [-10, 0, 0, 0, 0, 0]));
    //TODO: 触发连续剧情的龙:buff

    allEvents.push(createStatsChangeEvent(55, "亚当", CHARA_IMGS["亚当"], "善良的王和黑暗的王都是由迷途的灵魂幻化而成？", "你知道白色的王的具体消息吗？", "你知道黑色的王的的具体消息吗？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 0], [-10, 0, 0, 0, 0, 0]));
    //TODO: 触发王:buff

    allEvents.push(createStatsChangeEvent(55, "亚当", CHARA_IMGS["亚当"], "世间万物皆有两面性，灵魂亦不能跳出规则。", "你是在说灵魂的反转吗？", "具体的规则是？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 0], [-10, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(56, "矮人", CHARA_IMGS["矮人"], "需要矮人的烈酒吗？", "真有此意？", "手边没钱了？", "1", EventType.NORMAL, [-1, -1], [20, -10, 0, 0, 0, 0], [5, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent("57", "矮人", CHARA_IMGS["矮人"], "需要跟我学矮人优秀的战斗技巧吗？", "我正好想跟您学习?。", "并不是很感兴趣。", "1", EventType.NORMAL,
        [-1, -1], [-10, -10, 25, 0, 0, 0], [0, 0, 0, 0, 0, 0], null,
        [buildBuff(BUFF.MESSAGE, "矮人的战斗技巧|你学习了精湛的矮人的战斗方法")],
        null));


    //TODO: 第一转：面目可憎的狗
    allEvents.push(createStatsChangeEvent(59, "地狱犬", "img/8.png", "狗爱他们的朋友,咬他们的敌人,和人不同。", "看招吧恶魔", "似乎也有道理", "1", EventType.NORMAL, [-1, -1], [-20, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10]));
    allEvents.push(createMajorRandomEvent(91, "地狱犬", "img/8.png", "汪汪汪", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(92, "地狱犬", "img/8.png", "汪汪", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(93, "地狱犬", "img/8.png", "汪", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(111, "地狱犬", "img/8.png", "我们似乎见过很多次", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));


    //TODO: 第一转：神秘的枭
    allEvents.push(createStatsChangeEvent(62, "夜枭", CHARA_IMGS["夜枭"], "不知从哪一天开始，我喜欢上了黑夜。", "黑夜给了你力量吗？", "我不喜欢黑夜。", "1", EventType.NORMAL, [-1, -1], [0, 0, 10, 10, 10, -10], [0, 0, -10, -10, -10, 10]));
    allEvents.push(createMajorRandomEvent(93, "夜枭", CHARA_IMGS["夜枭"], "咕咕咕", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(94, "夜枭", CHARA_IMGS["夜枭"], "咕咕", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(95, "夜枭", CHARA_IMGS["夜枭"], "咕", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(110, "夜枭", CHARA_IMGS["夜枭"], "我们似乎见过很多次", "？？？", "！！！", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(115, "夜枭", CHARA_IMGS["夜枭"], "左边看似平坦，实乃艰途。右边有我我看不清的迷雾。", "hmm，从左边走把。", "hmm，从右边走吧。", "1", EventType.RANDOM, [-1, -1]));

    allEvents.push(createStatsChangeEvent(69, "亚当", CHARA_IMGS["亚当"], "我知道有人是爱我的，但我好像缺乏爱人的能力。", "你知道谁爱你吗？", "你知道你爱谁吗？", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 0, 10], [10, 0, 0, 0, 0, 10]));
    //TODO: 修女爱亚当？

    allEvents.push(createStatsChangeEvent(70, "亚当", CHARA_IMGS["亚当"], "因为怯懦，所以逃避生命，以不抵抗在最黑暗的沉沦中生出骄傲，因为骄傲，所以不选择生，所以拒斥粗鄙的乐观主义。", "又是一个可怜的灵魂。", "逃避是懦夫的行为", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 10, 10], [10, 0, 10, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(71, "亚当", CHARA_IMGS["亚当"], "我只想站在比你高的地方，用人类最纯粹的痛苦与烦恼给你一记响亮的耳光。", "黑暗的灵魂永堕沉沦。", "你的苦痛会永远持续下去。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [-10, 0, 10, 10, 10, -10]));
    allEvents.push(createStatsChangeEvent(72, "亚当", CHARA_IMGS["亚当"], "我的不幸，恰恰在于我缺乏拒绝的能力。", "缺乏拒绝能力会使你更加不幸。", "你只是太过善良罢了。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, -10, -10, -10, 10]));
    allEvents.push(createStatsChangeEvent(73, "亚当", CHARA_IMGS["亚当"], "唯有尽力自持，方不致癫狂。", "？？？", "你是说要克己吗？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 0], [10, 0, 10, 10, 10, 0]));
    allEvents.push(createStatsChangeEvent(81, "亚当", CHARA_IMGS["亚当"], "伊甸园中有棵禁止享用的果树，叫分辨善恶树，是上帝为考验人的信心而设置的。", "如果是夏娃给的苹果，我应该也会吃。", "不可以吃，也不能摸，免得你们死。", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 10, 0], [10, 0, 0, 0, 0, 5]));
    allEvents.push(createStatsChangeEvent(82, "亚当", CHARA_IMGS["亚当"], "年轻的时候以为那只是段感情，后来才知道，那其实是一生。", "心中有所爱之人亦是一种幸福。", "如果重来一次你会后悔吗？", "1", EventType.NORMAL, [-1, -1], [10, 0, 10, 10, 10, 0], [10, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(83, "亚当", CHARA_IMGS["亚当"], "疯子身上一把刀，鬼神也得让一步。", "举头三尺神明在。", "文明的结果是滑稽。", "1", EventType.NORMAL, [-1, -1], [10, 0, 0, 0, 0, 0], [10, 0, 0, 0, 0, -10]));
    allEvents.push(createStatsChangeEvent(84, "亚当", CHARA_IMGS["亚当"], "总之，因为活着所以一定要欺世盗名。", "迷途的灵魂，愿你得到安息。", "恶有恶报。", "1", EventType.NORMAL, [-1, -1], [-20, 0, 0, 0, 0, 10], [-10, 0, 0, 0, 0, 10]));
    allEvents.push(createStatsChangeEvent(85, "亚当", CHARA_IMGS["亚当"], "优于别人，并不高贵，真正的高贵应该是优于过去的自己。", "似乎很有道理。", "物竞天择。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, 0], [-10, 10, 10, 10, 10, -10]));
    allEvents.push(createStatsChangeEvent(86, "亚当", CHARA_IMGS["亚当"], "现在不是去想缺少什么的时候，该想一想凭现有的东西你能做什么。", "唯有砥砺前行。", "战略性撤退也是种方案。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, 0], [-10, -10, 0, 0, 0, 0]));

    //random test
    allEvents.push(createMinorRandomEvent(76, "七彩泉", CHARA_IMGS["七彩泉"], "七彩的泉水汩汩的涌现出来", "喝一口看看", "喝一口看看", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(76, "不老泉", CHARA_IMGS["不老泉"], "不老的泉水汩汩的涌现出来", "喝一口看看", "喝一口看看", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createStatsChangeEvent(97, "七彩泉", CHARA_IMGS["七彩泉"], "七彩的泉水汩汩的涌现出来。", "运一些回村子里卖钱。", "装一些泉水自己人喝。", "1", EventType.NORMAL, [-1, -1], [-10, 30, 0, 0, 0, -10], [10, 0, 0, 0, 0, 10]));
    allEvents.push(createMajorRandomEvent(98, "七彩泉", CHARA_IMGS["七彩泉"], "七彩的泉水里似乎透着可疑的绿光", "喝一口看看", "喝一口看看", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createMajorRandomEvent(99, "不老泉", CHARA_IMGS["不老泉"], "不老泉水里似乎透着可疑的绿光", "喝一口看看", "喝一口看看", "1", EventType.RANDOM, [-1, -1]));

    allEvents.push(createMajorRandomEvent(77, "幸运的金币", CHARA_IMGS["钱币"], "一枚金光闪闪的钱币", "抛一下试试运气", "抛一下试试运气", "1", EventType.RANDOM, [-1, -1]));

    // //比较，善良大于一定并且总属性够高。
    // allEvents.push(createStatsChangeEvent(78, "石中剑", CHARA_IMGS["石中剑"], "石头上插着一把荆棘缠绕的圣剑。", "拔出圣剑，我自为王。", "王者的使命过于沉重", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    // //TODO: 属性不够拔不出来 212 这里比较
    // allEvents.push(createStatsChangeEvent(212, "石中剑", CHARA_IMGS["石中剑"], "石中剑似乎纹丝不动。", "。。。", "。。。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));

    allEvents.push(createAdvancedEvent(
        new EventV2(78, "石中剑", CHARA_IMGS["石中剑"], "石头上插着一把荆棘缠绕的圣剑。", null, null, null, EventType.NORMAL, "拔出圣剑，我自为王。", "王者的使命过于沉重。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => (player.agility + player.power + player.intelligence) >= 200,
            null,
            [[20, 20, 20, 20, 20, 20], [-10, 0, 0, 0, 0, 0]],
            [null, null],
            [[buildBuff(BUFF.TITLE, "命中王者|拔出者为王")], [buildBuff(BUFF.MESSAGE, "没有效果|石中剑纹丝不动")]],
            [null, null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2(79, "朗格努斯", CHARA_IMGS["朗格努斯"], "枪身血红，似乎滴血一般。", null, null, null, EventType.NORMAL, "让我来用着魔枪结束乱世。", "王者的使命过于沉重。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => (player.agility + player.power + player.intelligence) >= 0,
            null,
            [[0, 0, 0, 0, 0, 0], null],
            [null, null],
            [[buildBuff(BUFF.NEXT, "79-1")], null],
            [null, null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("79-1", "朗格努斯", CHARA_IMGS["朗格努斯"], "朗格努斯仿佛活过来一般，不断吞噬着你的精力。", null, null, null, EventType.NORMAL, "。。。", "。。。"),
        new StartCondition(1, "79-1", null),
        new AdvancedEventAttrs(
            () => (player.agility + player.power + player.intelligence) >= 200,
            () => (player.agility + player.power + player.intelligence) >= 200,
            [[20, 20, 20, 20, 20, 20], null],
            [[20, 20, 20, 20, 20, 20], null],
            [[buildBuff(BUFF.MESSAGE, "坚强的意志|你凭借强大的精神力抵御住了朗格努斯的吞噬。"), buildBuff(BUFF.TITLE, "魔枪之主|你成为了魔枪的主人")], [buildBuff(BUFF.DEATH, "902")]],
            [[buildBuff(BUFF.MESSAGE, "坚强的意志|你凭借强大的精神力抵御住了朗格努斯的吞噬。"), buildBuff(BUFF.TITLE, "魔枪之主|你成为了魔枪的主人")], [buildBuff(BUFF.DEATH, "902")]]
        )
    ));


    // allEvents.push(createAdvancedEvent(
    //     new EventV2("80", "雷沃汀", CHARA_IMGS["雷沃汀"], "永远燃烧的火焰之剑。", null, null, null, EventType.NORMAL, "我能承受火焰之魂。", "冒火的剑怎么可能能拿得起来？"),
    //     new StartCondition(1, null, null),
    //     new AdvancedEventAttrs(
    //         () => (player.agility + player.power +player.intelligence) >= 0,
    //         null,
    //         [[0, 0, 0, 0, 0, 0], [-20, -20, -20, -20, -20, -20]],
    //         [null,null],
    //         [[buildBuff(BUFF.NEXT, "80-1"),[buildBuff(BUFF.MESSAGE, "雷沃汀的熊熊火焰灼伤了你！")]],
    //         [null, null]
    //     )
    // ));
    //
    allEvents.push(createAdvancedEvent(
        new EventV2("80-1", "雷沃汀", CHARA_IMGS["雷沃汀"], "雷沃汀熊熊的火焰不断吞噬着你。", null, null, null, EventType.NORMAL, "。。。", "。。。？"),
        new StartCondition(1, "80-1", null),
        new AdvancedEventAttrs(
            () => (player.agility + player.power + player.intelligence) >= 200,
            () => (player.agility + player.power + player.intelligence) >= 200,
            [[20, 20, 20, 20, 20, 20], [-20, -20, -20, -20, -20, -20]],
            [null, null],
            [[buildBuff(BUFF.MESSAGE, "强大的力量|你凭借强大的实力抵御了火焰的吞噬"), buildBuff(BUFF.TITLE, "火焰魔剑|你在冒险中得到了永远燃烧的火焰之剑。")], [buildBuff(BUFF.MESSAGE, "不够强大|雷沃汀的熊熊火焰灼伤了你！")]],
            [[buildBuff(BUFF.MESSAGE, "强大的力量|你凭借强大的实力抵御了火焰的吞噬"), buildBuff(BUFF.TITLE, "火焰魔剑|你在冒险中得到了永远燃烧的火焰之剑。")], [buildBuff(BUFF.MESSAGE, "不够强大|雷沃汀的熊熊火焰灼伤了你！")]]
        )
    ));

    // allEvents.push(createStatsChangeEvent("78", "石中剑", CHARA_IMGS["石中剑"], "石头上插着一把荆棘缠绕的圣剑。", "拔出圣剑，我自为王。", "王者的使命过于沉重", "1",
    //     EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], null, [buildBuff(BUFF.NEXT, "78-1")], null));

    //TODO: 属性不够，可以减属性
    // allEvents.push(createStatsChangeEvent("78-1", "石中剑", CHARA_IMGS["石中剑"], "石中剑似乎纹丝不动。", "。。。", "。。。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "78"), [buildBuff(BUFF.MESSAGE, "你尝试了许久放弃了！")],[buildBuff(BUFF.MESSAGE, "你尝试了许久放弃了！")]));
    // allEvents.push(createStatsChangeEvent("78-2", "石中剑", CHARA_IMGS["石中剑"], "你凭借强大的精神力抵御住了朗格努斯的吞噬。", "。。。", "。。。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "78"), [buildBuff(BUFF.TITLE, "石中剑")],[buildBuff(BUFF.TITLE, "石中剑")]));


    // allEvents.push(createStatsChangeEvent(79, "朗格努斯", CHARA_IMGS["朗格努斯"], "枪身血红，似乎滴血一般。", "让我来用着魔枪结束乱世。", "王者的使命过于沉重", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    // //TODO: 属性不够，死了 反噬 比较
    // allEvents.push(createStatsChangeEvent(213, "朗格努斯", CHARA_IMGS["朗格努斯"], "朗格努斯仿佛活过来一般，不断吞噬着你的精力。", "。。。", "。。。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    // allEvents.push(createStatsChangeEvent(213, "朗格努斯", CHARA_IMGS["朗格努斯"], "你凭借强大的精神力抵御住了朗格努斯的吞噬。", "。。。", "。。。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    //
    // allEvents.push(createStatsChangeEvent("79", "朗格努斯", CHARA_IMGS["朗格努斯"], "枪身血红，似乎滴血一般。", "让我来用着魔枪结束乱世。", "王者的使命过于沉重。", "1",
    //     EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], null, [buildBuff(BUFF.NEXT, "79")], null));
    //
    // //TODO: 属性不够，可以减属性
    // allEvents.push(createStatsChangeEvent("79-1", "朗格努斯", CHARA_IMGS["朗格努斯"], "朗格努斯仿佛活过来一般，不断吞噬着你的精力。", "。。。", "。。。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "79"), [buildBuff(BUFF.MESSAGE, "朗格努斯疯狂的吞噬了你")],[buildBuff(BUFF.MESSAGE, "朗格努斯疯狂的吞噬了你！")]));
    // allEvents.push(createStatsChangeEvent("79-1", "朗格努斯", CHARA_IMGS["朗格努斯"], "你凭借强大的精神力抵御住了朗格努斯的吞噬。", "。。。", "。。。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "79"), [buildBuff(BUFF.TITLE, "魔枪之主")],[buildBuff(BUFF.TITLE, "魔枪之主")]));

    // allEvents.push(createStatsChangeEvent(80, "雷沃汀", CHARA_IMGS["雷沃汀"], "永远燃烧的火焰之剑。", "我能承受火焰之魂。", "冒火的剑怎么可能能拿得起来？", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    // allEvents.push(createStatsChangeEvent("80", "雷沃汀", CHARA_IMGS["雷沃汀"], "永远燃烧的火焰之剑。", "我能承受火焰之魂。", "冒火的剑怎么可能能拿得起来？", "1",
    //     EventType.NORMAL, [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], null, [buildBuff(BUFF.NEXT, "80")], null));
    //
    // //TODO: 属性不够，可以减属性
    // allEvents.push(createStatsChangeEvent("80-1", "雷沃汀", CHARA_IMGS["雷沃汀"], "雷沃汀的熊熊火焰灼伤了你。", "。。。", "。。。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "80"), [buildBuff(BUFF.MESSAGE, "雷沃汀的熊熊火焰灼伤了你！")],[buildBuff(BUFF.MESSAGE, "雷沃汀的熊熊火焰灼伤了你！")]));
    // allEvents.push(createStatsChangeEvent("80-1", "雷沃汀", CHARA_IMGS["雷沃汀"], "你凭借强大的精神力抵御住了朗格努斯的吞噬。", "。。。", "。。。", "1", EventType.NORMAL,
    //     [-1, -1], [-10, 20, 0, 0, 0, 10], [0, 0, 0, 0, 0, -10], buildBuff(BUFF.BUFF, "80"), [buildBuff(BUFF.MESSAGE, "你成功获得了火焰魔剑雷沃汀！")],[buildBuff(BUFF.MESSAGE, "你成功获得了火焰魔剑雷沃汀！")]));

    // allEvents.push(createStatsChangeEvent(213, "雷沃汀", CHARA_IMGS["朗格努斯"], "雷沃汀的熊熊火焰灼伤了你。", "。。。", "。。。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));
    // allEvents.push(createStatsChangeEvent(213, "朗格努斯", CHARA_IMGS["朗格努斯"], "你凭借强大的精神力抵御住了朗格努斯的吞噬。", "。。。", "。。。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, -10], [-10, 0, 10, 10, 10, 10]));


    allEvents.push(createStatsChangeEvent(87, "闪闪的金币", CHARA_IMGS["钱币"], "地上有一枚闪闪发光金币。", "不关我的事。", "捡起来看看", "1", EventType.NORMAL, [-1, -1], [5, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0]));
    allEvents.push(createMajorRandomEvent(88, "不幸的金币", CHARA_IMGS["钱币"], "一枚金光闪闪的钱币", "抛一下试试运气", "抛一下试试运气", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createStatsChangeEvent(89, "闪闪的金币", CHARA_IMGS["钱币"], "地上有一堆闪闪发光金币。", "不关我的事。", "捡起来看看", "1", EventType.NORMAL, [-1, -1], [5, 0, 0, 0, 0, 0], [0, 10, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(90, "诅咒的金币", CHARA_IMGS["钱币"], "地上有一枚闪闪发光金币。", "不关我的事。", "捡起来看看", "1", EventType.NORMAL, [-1, -1], [5, 0, 0, 0, 0, 0], [-20, 20, -5, -5, -5, -5]));

    allEvents.push(createMajorRandomEvent(96, "修女", CHARA_IMGS["修女"], "不要相信白骑士的话。", "白骑士看上去是个好人。", "白骑士看上去不像个好人", "1", EventType.RANDOM, [-1, -1]));

    allEvents.push(createStatsChangeEvent(100, "商人", CHARA_IMGS["朗格努斯"], "一个街边的小贩似乎在贩卖着一把长枪。", "这个长枪一看就不是什么值钱的武器。", "看上去是个宝贝，买来看看。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 0, 0], [10, -10, 10, 10, 10, 10]));
    allEvents.push(createStatsChangeEvent(101, "商人", CHARA_IMGS["雷沃汀"], "一个街边的小贩似乎在贩卖着一把长剑。", "这个长剑一看就不是什么值钱的武器。", "看上去是个宝贝，买来看看。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 0, 0], [0, -10, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent(104, "士兵", CHARA_IMGS["士兵"], "能否帮我买把长剑？", "懒得做", "帮他买一下把。", "1", EventType.NORMAL, [-1, -1], [5, 0, 0, 0, 0, -10], [0, -10, 10, 0, 0, 10]));

    allEvents.push(createStatsChangeEvent(105, "盗贼", CHARA_IMGS["盗贼"], "能否帮我买个靴子？", "懒得做", "帮他买一下把。", "1", EventType.NORMAL, [-1, -1], [5, 0, 0, 0, 0, -10], [0, -10, 0, 10, 0, 10]));
    allEvents.push(createStatsChangeEvent(107, "密探", CHARA_IMGS["密探"], "我这里有大量的金币，如果告诉我情报那这些钱都是你的？。", "我对这桩买卖并不感兴趣。", "知无不答。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 0, 20], [0, 50, 0, 0, 0, -50]));
    //TODO: 有称号“守口如瓶”
    allEvents.push(createStatsChangeEvent(108, "密探", CHARA_IMGS["密探"], "我这里有上好的兵器，如果告诉我情报那它就归你了？。", "我对这桩买卖并不感兴趣。", "知无不答。", "1", EventType.NORMAL, [-1, -1], [0, 0, 0, 0, 0, 20], [0, 0, 10, 10, 10, -50]));
    allEvents.push(createMajorRandomEvent(109, "蒙面的旅人", CHARA_IMGS["蒙面的旅人"], "凡人无法见两王？", "这人怎么神神叨叨的", "这人怎么神神叨叨的。", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createStatsChangeEvent(112, "牧师", CHARA_IMGS["牧师"], "医生似乎有着什么阴谋？", "怎么可能？", "我相信你的话。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [10, -10, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(113, "白骑士", CHARA_IMGS["白骑士"], "巫妖看似智慧，实则都是谎言。", "怎么可能？", "我相信你的话。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 0, 0, 0, 10], [10, -10, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(114, "盗贼", CHARA_IMGS["盗贼"], "据说地狱犬也会说话。", "是这样的，我见过。", "这怎么可能。", "1", EventType.NORMAL, [-1, -1], [-10, 0, 10, 10, 10, 10], [-10, -10, 0, 0, 0, 0]));
    allEvents.push(createMajorRandomEvent(116, "猎人", CHARA_IMGS["猎人"], "年轻的冒险家，前方旅途艰险，是否需要后退一下？", "似乎言之有理。", "岂能轻易退缩。", "1", EventType.RANDOM, [-1, -1]));
    allEvents.push(createStatsChangeEvent(117, "商人", CHARA_IMGS["商人"], "年轻的冒险家，能否帮我运输一批货物？", "正好手头有点紧。", "还不如休息一下。", "1", EventType.NORMAL, [-1, -1], [-20, 30, 10, 0, 0, 0], [10, 0, 0, 0, 0, 0]));


    allEvents.push(createAdvancedEvent(
        new EventV2(118, "商人", CHARA_IMGS["商人"], "穷鬼，赶紧帮我去送一批货物，钱管够。", null, null, null, EventType.NORMAL, "这种人给我再多钱也不会帮他。", "看起来报酬丰富，还去运一下。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 0 && player.power >= 0,
            null,
            [[0, 0, 0, 0, 0, 50], null],
            [[-30, 15, 0, 0, 0, 10], null],
            [[buildBuff(BUFF.TITLE, "傲起冲天|仰天大笑出门去，我辈岂是蓬蒿人。")], null],
            [[buildBuff(BUFF.MESSAGE, "艰苦工作|你认真的完成了工作，商人看似富有，实则非常吝啬。")], null]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2(119, "商人", CHARA_IMGS["商人"], "穷鬼，赶紧帮我去送一批货物，钱管够。", null, null, null, EventType.NORMAL, "这种人给我再多钱也不会帮他。", "看起来报酬丰富，还去运一下。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 0 && player.power >= 0,
            null,
            [[0, 0, 0, 0, 0, 50], null],
            [[-30, 45, 0, 0, 0, 10], null],
            [[buildBuff(BUFF.TITLE, "傲起冲天|仰天大笑出门去，我辈岂是蓬蒿人。")], null],
            [[buildBuff(BUFF.MESSAGE, "艰苦工作|你认真的完成了工作，商人按照承诺给你了报酬。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2(120, "士兵", CHARA_IMGS["士兵"], "冒险者，我们被可恶的奸细出卖，能否帮我们完成突围？", null, null, null, EventType.NORMAL, "义不容辞。", "这种危险的事情还是算了。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.agility >= 0 && player.power >= 0,
            null,
            [[10, 0, 0, 0, 0, 50], null],
            [[0, 0, 0, 0, 0, -10], null],
            [[buildBuff(BUFF.TITLE, "勇者之路|修罗独走千里月明中。"),buildBuff(BUFF.NEXT , "120-1")], null],
            [[buildBuff(BUFF.TITLE, "小命要紧|你在危险的地方谨慎行事。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("120-1", "敌人", CHARA_IMGS["士兵"], "敌人：来者何人？", null, null, null, EventType.NORMAL, "接招吧。", "看起来有点危险，还是跑路吧。"),
        new StartCondition(1, "120-1", null),
        new AdvancedEventAttrs(
            () => player.agility >= 50 && player.power >= 50,
            null,
            [[-20, 0, 0, 0, 0, 50], null],
            [[0, 0, 0, 0, 0, -50], null],
            [[buildBuff(BUFF.MESSAGE, "浴血奋战|你奋力搏杀，在敌军之中七进七出。"),buildBuff(BUFF.NEXT , "120-2")], [buildBuff(BUFF.MESSAGE, "血战至死|你奋力搏杀，但双拳难敌四手，被淹没在人海之中。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.TITLE, "小命要紧|你在危险的地方谨慎行事。")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("120-2", "敌方将领", CHARA_IMGS["黑骑士"], "身着黑甲的骑士，徐徐走来:你还有最后次机会。", null, null, null, EventType.NORMAL, "我会遵守承诺，保护弱小。", "看起来有点危险，还是跑路吧。"),
        new StartCondition(1, "120-2", null),
        new AdvancedEventAttrs(
            () => player.agility >= 80 && player.power >= 80 && player.spirit > 50,
            null,
            [[50, 20, 20, 20, 0, 50], null],
            [[0, 0, 0, 0, 0, -50], null],
            [[buildBuff(BUFF.TITLE, "英雄无敌|青史它年又三篇。"),buildBuff(BUFF.MESSAGE, "刀光剑影|你在重围之中，与黑甲骑士数十次交手，最后抓住他的空隙，一举斩于马下。")], [buildBuff(BUFF.MESSAGE, "血战至死|你奋力搏杀，但黑甲骑士的枪尖宛如黑夜中的寒星，即瞬间就刺穿了你的咽喉。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.TITLE, "小命要紧|你在危险的地方谨慎行事。")], null]
        )
    ));

    //TODO: 不同路线遇到不同的王，神器buff 才进入比较环节，死亡（你的（武器）在王的面前不堪一击）
    allEvents.push(createStatsChangeEvent(500, "邪恶的王", CHARA_IMGS["邪恶的王"], "你看上去过于羸弱，不堪一击，今天就放你一马。", "你们boss都这个套路吗？", "...", "5", EventType.NORMAL, [-1, -1], [-50, 0, 0, 0, 0, 20], [-10, 0, 0, 0, 0, 20]));
    allEvents.push(createStatsChangeEvent(500, "善良的王", CHARA_IMGS["善良的王"], "你看上去过于羸弱，不堪一击，今天就放你一马。", "你们boss都这个套路吗？", "...", "5", EventType.NORMAL, [-1, -1], [-50, 0, 0, 0, 0, 20], [-10, 0, 0, 0, 0, 20]));

    allEvents.push(createStatsChangeEvent(502, "邪恶的王", CHARA_IMGS["邪恶的王"], "你身上邪恶的味道我很讨厌。", "岂能放过你。", "岂能放过你。", "5", EventType.NORMAL, [-1, -1], [-50, 0, 0, 0, 0, 20], [-50, 0, 0, 0, 0, 20]));
    allEvents.push(createStatsChangeEvent(503, "善良的王", CHARA_IMGS["善良的王"], "你身上伪善的味道我很讨厌。", "岂能放过你。", "岂能放过你。", "5", EventType.NORMAL, [-1, -1], [-50, 0, 0, 0, 0, 20], [-50, 0, 0, 0, 0, 20]));

    //TODO: 兵器的buff怎么判断
    allEvents.push(createAdvancedEvent(
        new EventV2("502-1", "善良的王", CHARA_IMGS["善良的王"], "王用手抓向你的武器。", null, null, null, EventType.NORMAL, "顺势攻击他的肩膀。", "顺势攻击他的肩膀。"),
        new StartCondition(1, "502-1", null),
        new AdvancedEventAttrs(
            () => player.intelligence >= 50 && player.spirit >= 50,
            null,
            [[10, 10, 0, 0, 30, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.MESSAGE, "入手|王之手")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [null, null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("502-2", "502-2", CHARA_IMGS["善良的王"], "王迅速的挥动长剑，向你袭来。", null, null, null, EventType.NORMAL, "靠力量挡住这次攻击。", "赶紧闪避这次攻击。"),
        new StartCondition(1, 502 - 1, null),
        new AdvancedEventAttrs(
            () => player.intelligence >= 50 && player.spirit >= 50,
            null,
            [[10, 10, 0, 0, 30, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.NEXT, "502-1")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [null, null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2("502-3", "502-3", CHARA_IMGS["善良的王"], "王用手抓向你的武器。", null, null, null, EventType.NORMAL, "迅速打断他的技能。", "用魔力优先构建魔法盾。"),
        new StartCondition(1, 502 - 1, null),
        new AdvancedEventAttrs(
            () => player.intelligence >= 50 && player.spirit >= 50,
            null,
            [[10, 10, 0, 0, 30, 0], null],
            [[0, 0, 0, 0, 0, 10], [0, 0, 0, 0, 0, 10]],
            [[buildBuff(BUFF.NEXT, "502-1")], [buildBuff(BUFF.DEATH, 'dead-1')]],
            [null, null]
        )
    ));

    allEvents.push(createStatsChangeEvent("stage-1", "村落", CHARA_IMGS["村落"], "从黑夜中醒来，晨起的星光璀璨，照亮了远方的小村。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-2", "城镇", CHARA_IMGS["城镇"], "行走了许久，也没有丝毫感到饥饿，前方似乎有个更大的城镇。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-3", "城堡", CHARA_IMGS["城堡"], "高耸的城堡是贵族的象征。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-4", "洞窟", CHARA_IMGS["洞窟"], "洞口矗立一个巨大的峻岩，犹如阴曹的判官。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-5", "森林", CHARA_IMGS["森林"], "幽静的密林深处，连鸟儿也很少飞来。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-6", "悬崖", CHARA_IMGS["悬崖"], "巍峨的云峰上，峭壁生辉，而我的脚步愈发轻快。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-7", "沼泽", CHARA_IMGS["沼泽"], "泥泞不堪,满目疮痍。我的脚蹼却丝毫不受沼泽的拖累。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-8", "冰原", CHARA_IMGS["冰原"], "茕茕孑立，踽踽而行。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent("stage-9", "岩浆", CHARA_IMGS["岩浆"], "末日般的场景，与一个挣扎的灵魂。", "", "", "1", EventType.STAGE, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));

    //触发
    allEvents.push(createStatsChangeEvent("stage-1-end", "村落", CHARA_IMGS["村落"], "你在村落的西方发现一条通往大路的通道。", "朝大路走去", "在村子里继续转一转。", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-1")]));
    allEvents.push(createStatsChangeEvent("stage-2-end", "城镇", CHARA_IMGS["城镇"], "村落的中心的高台下似乎有条密道。", "去调查一下看看", "在城镇里继续转一转", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-2")]));
    allEvents.push(createStatsChangeEvent("stage-3-end", "城堡", CHARA_IMGS["城堡"], "城堡的出口处似乎有个魔物。", "去挑战魔物。", "继续在城堡里看看好了", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-3")]));
    allEvents.push(createStatsChangeEvent("stage-4-end", "洞窟", CHARA_IMGS["洞窟"], "你在洞穴深处看到了一个天然的泉水。", "去泉水周围看看", "回头转转洞窟。", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-4")]));
    allEvents.push(createStatsChangeEvent("stage-5-end", "森林", CHARA_IMGS["森林"], "森林的隐秘处似乎有着一个孤坟。", "去调查一下看看。", "森林里继续逛逛", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-5")]));
    allEvents.push(createStatsChangeEvent("stage-6-end", "悬崖", CHARA_IMGS["悬崖"], "云峰之巅，似乎有着宝藏。", "上顶峰瞅瞅。", "继续在悬崖周围转转", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-6")]));
    allEvents.push(createStatsChangeEvent("stage-7-end", "沼泽", CHARA_IMGS["沼泽"], "沼泽深处隐藏着一个可怕的魔物。", "前往沼泽深处。", "继续在周围转转。", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-7")]));
    allEvents.push(createStatsChangeEvent("stage-8-end", "冰原", CHARA_IMGS["冰原"], "浩渺的冰原上，矗立着一个奇怪的神殿。", "进入神殿。", "回头继续前行。", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-8")]));
    allEvents.push(createStatsChangeEvent("stage-9-end", "岩浆", CHARA_IMGS["岩浆"], "岩浆的尽头是一个落魄的祭坛。", "祭坛里有什么？", "我是谁？", "1", EventType.BOSS,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "boss-9")]));

    //0结束 -1 随机 其他数字是链接
    //称号，buff
    allEvents.push(createStatsChangeEvent(601, "称号", "1.png", "法海无边", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(602, "称号", "1.png", "时光飞逝", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(603, "称号", "1.png", "时光荏苒", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(604, "称号", "1.png", "战争艺术", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(605, "称号", "1.png", "海上传奇", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(606, "称号", "1.png", "别无所求", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(607, "称号", "1.png", "屠杀殆尽", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(608, "称号", "1.png", "恃强凌弱", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(609, "称号", "1.png", "巨龙传说", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(610, "称号", "1.png", "傲气冲天", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(611, "称号", "1.png", "英雄气短", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(612, "称号", "1.png", "任人宰割", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(613, "称号", "1.png", "勇者之路", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(614, "称号", "1.png", "殊死一搏", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(615, "称号", "1.png", "英雄本色", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(616, "称号", "1.png", "胜利逃亡", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(617, "称号", "1.png", "妙手空空", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(618, "称号", "1.png", "凤凰涅槃", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(619, "称号", "1.png", "巨人杀手", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(620, "称号", "1.png", "命运星空", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(621, "称号", "1.png", "战士之魂", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(622, "称号", "1.png", "九头蛇之死", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(623, "称号", "1.png", "舍生取法", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    allEvents.push(createStatsChangeEvent(624, "称号", "1.png", "恐怖巨兽", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));

    // allEvents.push(createStatsChangeEvent(600, "称号", "img/102.png", "孤魂野鬼", "Pass", "Pass.", "", EventType.DEATH, [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(800, "称号", "img/10.png", "卷土重来", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(801, "称号", "1.png", "咫尺天堂", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(802, "称号", "1.png", "咫尺地狱", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(803, "称号", "1.png", "一念天堂", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));
    // allEvents.push(createStatsChangeEvent(804, "称号", "1.png", "一念地狱", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]));

    allEvents.push(createStatsChangeEvent("dead-1", "称号", "img/102.png", "孤魂野鬼", "Pass", "Pass.", "", EventType.DEATH,
        [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "result")], [buildBuff(BUFF.NEXT, "result")]));
    allEvents.push(createStatsChangeEvent("dead-2", "称号", "img/10.png", "卷土重来", "Pass。", "Pass.", "1", EventType.DEATH,
        [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "result")], [buildBuff(BUFF.NEXT, "result")]));
    allEvents.push(createStatsChangeEvent("dead-3", "称号", "1.png", "咫尺天堂", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1],
        [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "result")], [buildBuff(BUFF.NEXT, "result")]));
    allEvents.push(createStatsChangeEvent("dead-4", "称号", "1.png", "咫尺地狱", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1],
        [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "result")], [buildBuff(BUFF.NEXT, "result")]));
    allEvents.push(createStatsChangeEvent("dead-5", "称号", "1.png", "一念天堂", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1],
        [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "result")], [buildBuff(BUFF.NEXT, "result")]));
    allEvents.push(createStatsChangeEvent("dead-6", "称号", "1.png", "一念地狱", "Pass。", "Pass.", "1", EventType.DEATH, [-1, -1],
        [0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "result")], [buildBuff(BUFF.NEXT, "result")]));


    //ending transition
    allEvents.push(createStatsChangeEvent("end-1", "天空。。。", "img/stage/yomi.jpg", "走了很久，也没有再遇到人，头上则是一片湛蓝的天空", "", "", "1", EventType.ENDING,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "end-2")], [buildBuff(BUFF.NEXT, "end-2")]));
    allEvents.push(createStatsChangeEvent("end-2", "天空的下方。。。", "img/stage/yomi1.jpg", "天空下方，是。。。？！", "", "", "1", EventType.ENDING,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "end-3")], [buildBuff(BUFF.NEXT, "end-3")]));
    allEvents.push(createStatsChangeEvent("end-3", "白光。。。", "img/stage/yomi1.jpg", "白光，闪过。。。？！", "", "", "1", EventType.ENDING,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "end-4")], [buildBuff(BUFF.NEXT, "end-4")]));
    allEvents.push(createStatsChangeEvent("end-4", "梦的终结。。", "img/stage/empty_image.png", "仿佛做了一个悠长而又意犹未尽的梦", "", "", "1", EventType.ENDING,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[0])], [buildBuff(BUFF.NEXT, STAGE_IDS[0])]));

    //boss event
    createLevel1BossEvents(allEvents);
    createLevel2BossEvents(allEvents);
    createLevel3BossEvents(allEvents);
    createLevel4BossEvents(allEvents);
    createLevel5BossEvents(allEvents);
    createLevel6BossEvents(allEvents, 6);
    createLevel7BossEvents(allEvents, 7);
    createLevel8BossEvents(allEvents, 8);
     createLevel9BossEvents(allEvents, 9);
    // createLevel9BossEvents(allEvents);

    allEvents.push(createStatsChangeEvent("result", "称号", "1.png", "法海无边", "Pass。", "Pass.", "1", EventType.RESULT,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "upload")], [buildBuff(BUFF.NEXT, "upload")]));
    allEvents.push(createStatsChangeEvent("upload", "称号", "1.png", "法海无边", "Pass。", "Pass.", "1", EventType.UPLOAD,
        [-1, -1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[0])], [buildBuff(BUFF.NEXT, STAGE_IDS[0])]));
    return allEvents;
}

//Utils

// device detection
function isMobile() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        return true;
    }
    return false;
}

function getRandomArrayElements(arr, count) {
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

const ATTRS = ['spirit', 'gold', 'power', 'agility', 'intelligence', 'goodness'];

const playerId = "DefaultId";

class Player {
    constructor(name, id) {
        this.id = id;
        this.name = name;
        this.fatigue = MAX_VAL;
        this.spirit = MAX_VAL;
        this.gold = MAX_VAL;
        this.power = MAX_VAL;
        this.agility = MAX_VAL;
        this.intelligence = MAX_VAL;
        this.goodness = MAX_VAL;
        this.buffSet = new Set();
        this.achievements = new Set();
    }

    getAllTitles() {
        return Array.from(this.achievements).filter(ach => ach.startsWith(BUFF.TITLE));
    }
}

const EventType = Object.freeze({
    NORMAL: "NORMAL",
    BOSS: "BOSS",
    STAGE: "STAGE",
    DEATH: "DEATH",
    UPLOAD: "UPLOAD",
    RESULT: "RESULT",
    SUBSEQUENT: "SUBSEQUENT",
    ENDING: "ENDING",
});

class StartCondition {
    constructor(startStage, startAchievement, startBuff) {
        this.startStage = startStage;
        this.startAchievement = startAchievement;
        this.startBuff = startBuff;
    }
}

class AdvancedEventAttrs {
    constructor(condition1, condition2, statChangeDuo1, statChangeDuo2, buffDuo1, buffDuo2) {
        this.condition1 = condition1;
        this.condition2 = condition2;
        this.statChangeDuo1 = statChangeDuo1;
        this.statChangeDuo2 = statChangeDuo2;
        this.buffDuo1 = buffDuo1;
        this.buffDuo2 = buffDuo2;
    }
}

class AdvancedEventAttrsV2 {
    constructor(condition, callBackSeqs) {
        this.condition = condition;
        this.callBackSeqs = callBackSeqs;
    }
}

class EventV2 {
    constructor(id, name, img, line, startStage, startAchievement, startBuff, eventType, choice1, choice2, enemy) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.line = line;
        this.startStage = startStage;
        this.startAchievement = startAchievement;
        this.startBuff = startBuff;
        this.eventType = eventType;
        this.choice1 = choice1;
        this.choice2 = choice2;
        this.enemy = enemy;
    }
}

class Choice {
    constructor(eventId, line, effect) {
        this.eventId = eventId;
        this.line = line;
        this.effect = effect
    }
}

class Change {
    constructor(statsChange, buffs) {
        this.statsChange = statsChange;
        this.buffs = buffs;
    }
}

const EffectType = Object.freeze({
    NOOP: "NOOP",
    STATS_CHANGE: "STATS_CHANGE",
    STATS_COND: "STATS_COND",
    ADD_BUFF: "ADD_BUFF",
    RANDOM: "RANDOM",
    COMPOSITE: "COMPOSITE" //复合型类型，比如随机 + buff
});

const BUFF = Object.freeze({
    BUFF: "BUFF",
    NEXT: "NEXT", // NEXT EVENT
    DEATH: "DEATH",
    TITLE: "TITLE",
    COMPLETE: "COM",
    MESSAGE: "MESSAGE"
});

function buildBuff(buff, desc) {
    return buff + ":" + desc;
}

class EffectV2 {
    constructor(effectId, effectType, callBack) {
        if (!effectType in EffectType) {
            throw Error("Invalid effectType: " + effectType);
        }
        this.effectId = effectId;
        this.effectType = effectType;
        this.callBack = callBack;
    }
}


function createLevel1BossEvents(allEvents) {

    //boss example
    const level = "1";
    const id = "boss-" + level;
    const name = "阴影中的神秘人";
    allEvents.push(createAdvancedEvent(
        new EventV2(id, "阴影中的神秘人", CHARA_IMGS["间谍"], "阴影中走出一个神秘人，他在黑暗之中凝视着你。", null, null, null, EventType.NORMAL, "朝他点头示意。", "低头走开。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[0, 0, 0, 0, 0, 0], null],
            [[0, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "点头示意|你朝着神秘人轻轻点了一下头"),buildBuff(BUFF.NEXT, "boss1-1")], null],
            [[buildBuff(BUFF.MESSAGE, "低头走开|你你漠视了神秘人低头走开"),buildBuff(BUFF.NEXT, "boss1-1")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss1-1', "阴影中的神秘人", CHARA_IMGS["间谍"], "神秘人声音低沉地说到：没想到你又苏醒了。", null, null, null, EventType.SUBSEQUENT, "你是不是认错人了？", "我沉睡了很久吗？"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[0, 0, 0, 0, 10, 0], null],
            [[10, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "思考|你思考着神秘人的话，但是并不相信他。"),buildBuff(BUFF.NEXT, "boss1-2")], null],
            [[buildBuff(BUFF.MESSAGE, "探索|你想要从知道更多之前的故事。"),buildBuff(BUFF.NEXT, "boss1-2")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss1-2', "阴影中的神秘人", CHARA_IMGS["间谍"], "神秘人仿佛笑了一下，说道：我不会认错你的。你还记得故事是怎么开始的吗？", null, null, null, EventType.SUBSEQUENT, "记得。", "忘记了。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[0, 0, 10, 10, 10, 0], null],
            [[20, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "坚信|你的语气坚定，回忆起了很多之前的事情。"),buildBuff(BUFF.NEXT, "boss1-3")], null],
            [[buildBuff(BUFF.MESSAGE, "迷惘|你并不记得之前发生了什么，似乎有些迷惘。"),buildBuff(BUFF.NEXT, "boss2-1")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss1-3', "阴影中的神秘人", CHARA_IMGS["间谍"], "神秘人递过来一把黝黑的匕首。神秘人：这是你的东西，希望这次它能帮上你。", null, null, null, EventType.SUBSEQUENT, "谢谢。", "谢谢。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[10, 0, 0, 0, 0, 0], null],
            [[10, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "神秘的匕首|匕首通体黝黑，仿佛在黑夜之中的勾魂使者。"),buildBuff(BUFF.BUFF, 'dagger'),buildBuff(BUFF.NEXT, STAGE_IDS[level])], null],
            [[buildBuff(BUFF.MESSAGE, "神秘的匕首|匕首通体黝黑，仿佛在黑夜之中的勾魂使者。"),buildBuff(BUFF.BUFF, 'dagger'),buildBuff(BUFF.NEXT, STAGE_IDS[level])], null]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2('boss2-1', "阴影中的神秘人", CHARA_IMGS["间谍"], "神秘人叹了口气：又是一次新的开始。", null, null, null, EventType.SUBSEQUENT, "什么开始？", "我是谁？"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[0, 0, 0, 0, 0, 0], null],
            [[0, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "轮回的故事|这也许是个轮回的故事。"),buildBuff(BUFF.NEXT, "boss2-2")], null],
            [[buildBuff(BUFF.MESSAGE, "我是谁|是终结，是开始，亦或是一场新生？"),buildBuff(BUFF.NEXT, "boss2-2")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss2-2', "阴影中的神秘人", CHARA_IMGS["间谍"],
            "神秘人：我只说一次，希望这次你能明白。这是一个交织的世界，无数的故事，文化，宗教编织而成，而观看这个世界的你我，亦不过是被观察者。那么这次你会如何选择呢？", null, null, null, EventType.SUBSEQUENT, "什么？", "什么？"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[0, 0, 0, 0, 0, 0], null],
            [[0, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "离去|身影渐行渐远，直到消失在阴影中。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])], null],
            [[buildBuff(BUFF.MESSAGE, "离去|身影渐行渐远，直到消失在阴影中。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])], null]
        )
    ));

    // const boss = new Player(name, id);
    // const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["神秘人"], "看不清面孔的人向这边袭来。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");
    //
    // //TODO: 这个logic是错的= =！
    // const preLogic = function (baseEvent) {
    //     if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
    //         baseEvent.choice1 = "使用不知何时得到的巨剑";
    //     }
    // };
    //
    // const leftCallback = () => {
    //     if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
    //         boss.power -= 50;
    //     }
    // };
    //
    // //Do nothing
    // const rightCallback = () => {
    // };
    // const winCheck = () => {
    //     return player.power >= boss.power;
    // };
    //
    // const leftWin = id + "-win";
    // const rightWin = id + "-win";
    // const leftLoss = id + "-loss";
    // const rightLoss = id + "-loss";
    //
    // allEvents.push(createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss));
    // allEvents.push(createStatsChangeEvent(id + "-win", "", CHARA_IMGS["间谍"], "（微笑）你醒了吗，你的力量比我强大，不过后面更难的试炼在等待着你。。。", "好吧", "。。。", "1", EventType.SUBSEQUENT, null,
    //     [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[level])], [buildBuff(BUFF.NEXT, STAGE_IDS[level])]));
    // allEvents.push(createStatsChangeEvent(id + "-loss", "", CHARA_IMGS["间谍"], "就差一点，你还是继续沉睡吧。。", "好吧", "", "1", EventType.SUBSEQUENT, null,
    //     [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")], [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")]));
}

function createLevel2BossEvents(allEvents) {

    //boss example
    const level = "1";
    const id = "boss-wolf-" + level;
    const name = "恶狼";
    allEvents.push(createAdvancedEvent(
        new EventV2(id, "恶狼", CHARA_IMGS["恶狼"], "地窖中深处一双猩红色的眼睛，骤然出现。", null, null, null, EventType.NORMAL, "那是什么？", "那是什么？"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[-20, 0, 0, 0, 0, 0], null],
            [[-20, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "电光石火|猩红色的眼睛突然拉近距离，转瞬间你被扑倒在地。"),buildBuff(BUFF.NEXT, "boss-wolf-1-1")], null],
            [[buildBuff(BUFF.MESSAGE, "电光石火|猩红色的眼睛突然拉近距离，转瞬间你被扑倒在地。"),buildBuff(BUFF.NEXT, "boss-wolf-1-1")], null]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-1-1', "血色双眼的恶狼", CHARA_IMGS["恶狼"], "恶狼把你扑倒在地，你只感觉闷热的吐息不断涌向脸上。", null, null, null, EventType.SUBSEQUENT, "努力挣脱。", "掀翻恶狼。"),
        new StartCondition(1, "boss-wolf-1-1", null),
        new AdvancedEventAttrs(
            () => player.agility >= 50,
            () => player.power >= 50,
            [[0, 0, 0, 0, 0, 0], null],
            [[0, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "身手敏捷|你机敏的闪过了恶狼的撕咬，一个翻身就与恶狼拉开了距离。"),buildBuff(BUFF.NEXT, "boss-wolf-1-2")], [buildBuff(BUFF.MESSAGE, "难逃一死|你尝试躲过恶狼的撕咬，但是恶狼迅速的咬住了你的脖子。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "以力破巧|你凭着过人的臂力，钳制住恶狼的脖子，一把把他甩飞出去。"),buildBuff(BUFF.NEXT, "boss-wolf-1-2")], [buildBuff(BUFF.MESSAGE, "难逃一死|你尝试掀翻恶狼，但是恶狼硬扭过了身子，狠狠地咬住了你的脖子。"),buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-1-2', "恶狼", CHARA_IMGS["恶狼"], "恶狼徘徊在远处的阴影间。", null, null, null, EventType.SUBSEQUENT, "使用武技。", "施展法术。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.power >= 50,
            () => player.intelligence >= 50,
            [[-20, 0, 0, 0, 0, 0], null],
            [[-20, 0, 0, 0, 0, 0], null],
            [[buildBuff(BUFF.MESSAGE, "冲锋|你瞄准恶狼，使用出了冲锋。"),buildBuff(BUFF.NEXT, "boss-wolf-2-1")], [buildBuff(BUFF.MESSAGE, "难逃一死|你尝试冲锋，但是羸弱的冲击并没有造成什么伤害，恶狼狠狠地咬住了你的脖子。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "奥术|你瞄准恶狼，开始施展魔法。"),buildBuff(BUFF.NEXT, "boss-wolf-2-2")], [buildBuff(BUFF.MESSAGE, "难逃一死|你尝试施展法术，但是匮乏的法力值并没有吟唱出法术，恶狼迅速的咬住了你的脖子。"),buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-2-2', "恶狼", CHARA_IMGS["恶狼"], "恶狼疾如闪电地扑了上来。", null, null, null, EventType.SUBSEQUENT, "屏气凝神。", "屏气凝神。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            //这里想写个随机 如果敏捷低于50 有一半几率miss
            () => player.agility >= 50,
            () => player.agility >= 50,
            [[0, 0, 0, 0, 0, 0], [-20, 0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0, 0], [-20, 0, 0, 0, 0, 0]],
            [[buildBuff(BUFF.MESSAGE, "快速施法|关键时刻，你的法术仿佛无需吟唱一般直接施展了出来，漫天的火雨照亮了整个地窖。"),buildBuff(BUFF.NEXT,"boss-wolf-3-1")], [buildBuff(BUFF.MESSAGE, "一击毙命|恶狼直接咬断了你的脖子。"),buildBuff(BUFF.DEATH, 'dead-1')]],
            [[buildBuff(BUFF.MESSAGE, "快速施法|关键时刻，你的法术仿佛无需吟唱一般直接施展了出来，漫天的火雨照亮了整个地窖。"),buildBuff(BUFF.NEXT,"boss-wolf-3-1")], [buildBuff(BUFF.MESSAGE, "一击毙命|恶狼直接咬断了你的脖子。"),buildBuff(BUFF.DEATH, 'dead-1')]]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-2-1', "恶狼", CHARA_IMGS["恶狼"], "恶狼左右摇摆，想要躲避你的冲锋。", null, null, null, EventType.SUBSEQUENT, "屏气凝神。", "屏气凝神。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            //这里想写个随机 如果敏捷低于50 有一半几率miss
            () => player.agility >= 50,
            () => player.agility >= 50,
            [[0, 0, 0, 0, 0, 0], [-20, 0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0, 0], [-20, 0, 0, 0, 0, 0]],
            [[buildBuff(BUFF.MESSAGE, "正中靶心|你精准的撞击到了恶狼，直接把它轰飞了出去。"),buildBuff(BUFF.NEXT,"boss-wolf-3-1")], [buildBuff(BUFF.MESSAGE, "痛失良机|恶狼躲过了你的攻击，并且趁机咬伤了你的脖子。"),buildBuff(BUFF.NEXT, 'boss-wolf-1-2')]],
            [[buildBuff(BUFF.MESSAGE, "正中靶心|你精准的撞击到了恶狼，直接把它轰飞了出去。"),buildBuff(BUFF.NEXT,"boss-wolf-3-1")], [buildBuff(BUFF.MESSAGE, "痛失良机|恶狼躲过了你的攻击，并且趁机咬伤了你的脖子。"),buildBuff(BUFF.NEXT, 'boss-wolf-1-2')]]
        )
    ));

    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-3-1', "恶狼", CHARA_IMGS["恶狼"], "恶狼在远处喘息着，似乎受伤了。", null, null, null, EventType.SUBSEQUENT, "趁胜追击。", "慢慢退去。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null,
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[buildBuff(BUFF.TITLE, "趁胜追击|你把握机会，追击受伤的敌人。"),buildBuff(BUFF.NEXT,"boss-wolf-4-1")], [buildBuff(BUFF.TITLE, "见好就收|缓缓退去，明智的选择。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])]],
            [[buildBuff(BUFF.TITLE, "趁胜追击|你把握机会，追击受伤的敌人。"),buildBuff(BUFF.NEXT,"boss-wolf-4-1")], [buildBuff(BUFF.TITLE, "见好就收|缓缓退去，明智的选择。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])]]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-4-1', "恶狼", CHARA_IMGS["恶狼"], "恶狼猩红色的眼睛凝视着你，似乎做好了殊死一搏的准备。", null, null, null, EventType.SUBSEQUENT, "长驱直入。", "诱敌深入。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            () => player.spirit >= 50,
            () => player.intelligence >= 80 ,
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
            [[buildBuff(BUFF.MESSAGE, "长驱直入|你趁精力旺盛，一把把恶狼打倒在地。"),buildBuff(BUFF.NEXT,"boss-wolf-3-1")], [buildBuff(BUFF.MESSAGE, "痛失良机|恶狼躲过了你的攻击，并且趁机咬伤了你的脖子。"),buildBuff(BUFF.NEXT, 'boss-wolf-1-2')]],
            [[buildBuff(BUFF.MESSAGE, "诱敌深入|你卖了个破绽，躲过了恶狼的攻击，并一把把它砍翻在地上。"),buildBuff(BUFF.NEXT,"boss-wolf-3-1")], [buildBuff(BUFF.MESSAGE, "痛失良机|恶狼没有上当，直接咬伤了你的脖子。"),buildBuff(BUFF.NEXT, 'boss-wolf-1-2')]]
        )
    ));


    allEvents.push(createAdvancedEvent(
        new EventV2('boss-wolf-4-1', "恶狼", CHARA_IMGS["恶狼"], "恶狼在地上奄奄一息。", null, null, null, EventType.SUBSEQUENT, "杀死它。", "放过它。"),
        new StartCondition(1, null, null),
        new AdvancedEventAttrs(
            null,
            null ,
            [[0, 0, 0, 0, 0, 0], null],
            [[0, 0, 0, 0, 0, 50], null],
            [[buildBuff(BUFF.TITLE, "屠杀殆尽|你毫不留情的击杀了恶狼。"),buildBuff(BUFF.BUFF, '狼牙'),buildBuff(BUFF.MESSAGE, '狼牙|你获得了一颗带血的狼牙'),buildBuff(BUFF.NEXT, STAGE_IDS[level])],null],
            [[buildBuff(BUFF.TITLE, "放下屠刀|你放弃了击杀恶狼，缓缓离去。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])], null]
        )
    ));

}


function createLevel3BossEvents(allEvents) {

    const level = "3";
    const id = "boss-" + level;
    const name = "古树之神";
    const boss = new Player(name, id);


    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}`, "黑暗中一个身影", CHARA_IMGS["暗影牧师"], "城堡的尽头，一个黑暗中的身影伫立着。。。", null, null, null, EventType.BOSS, "尝试对话。", "趁机偷袭。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.gold <= 25) return 2;
                if (player.gold <= 50) return 1;
                if (player.gold <= 100) return 0;
            },
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-2`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-3`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
           null,
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`)])],
                ]
        ))
    );

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1`, "狡猾的暗影牧师", CHARA_IMGS["暗影牧师"], "你看起来没什么钱，如果你答应我从你身上抽取一些力量，我就放你过去。", null, null, null, EventType.SUBSEQUENT, "看上去有点强，要不答应他吧。", "岂有妥协的道理，看招。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [randomStageChangeCallback2(50, 50), buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "邪恶仪式|你答应了暗影牧师的要求，感觉身上一部分力量被剥夺了"), buildBuff(BUFF.MESSAGE, "邪恶仪式|随机属性-50。")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.MESSAGE, "先发制人|你奋起攻向暗影牧师，抢得了先机。"),buildBuff(BUFF.TITLE, "先发制人|先手优势。")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2`, "狡猾的暗影牧师", CHARA_IMGS["暗影牧师"], "你看起来没什么钱，如果你答应我从你身上抽取一些精力，我就放你过去。。。", null, null, null, EventType.SUBSEQUENT, "看上去有点强，要不答应他吧。", "岂有妥协的道理，看招。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([-50, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "邪恶仪式|你答应了暗影牧师的要求，感觉身上一部分精力被剥夺了"), buildBuff(BUFF.MESSAGE, "邪恶仪式|精力-50。")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.MESSAGE, "先发制人|你奋起攻向暗影牧师，抢得了先机。"),buildBuff(BUFF.TITLE, "先发制人|先手优势。")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3`, "狡猾的暗影牧师", CHARA_IMGS["暗影牧师"], "你看起挺富，如果你答应我给我一大笔钱，我就放你过去。。。", null, null, null, EventType.SUBSEQUENT, "看上去有点强，要不答应他吧。", "岂有妥协的道理，看招。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([0, -100, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "用钱开路|有钱能使鬼推磨"), buildBuff(BUFF.MESSAGE, "用钱开路|金钱-50。")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.MESSAGE, "先发制人|你奋起攻向暗影牧师，抢得了先机。"),buildBuff(BUFF.TITLE, "先发制人|先手优势。")])],
            ]
        )
    ));


    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1-1`, "受伤的暗影牧师", CHARA_IMGS["暗影牧师"], "被你打得措手不及的暗影牧师狼狈不堪", null, null, null, EventType.SUBSEQUENT, "使用冲锋", "投掷匕首"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.power >= 80) && (player.agility>=80)) return 0;
                if (randomIntFromInterval(0,10)>=5) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "正中靶心|你准确的命中暗影牧师，直接把他撞飞出去！")])],
                [statChangeCallback([-20, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "痛失良机|你并没有击中暗影牧师，反而被他邪恶的咒语抽取了部分力量！")])]

            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.power >= 40) && (player.agility>=150) && randomIntFromInterval(0,10)>=5 ) return 0;
                if ((player.power >= 40) && (player.agility>=120)) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]),buildBuff(BUFF.TITLE, "一击毙命|直接斩杀目标"),buildBuff(BUFF.MESSAGE, "一击毙命|你准确的命中暗影牧师的咽喉，直接斩杀了他"),buildBuff(BUFF.MESSAGE, "离去|你收拾完残局后离开了城堡")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "正中靶心|你准确的命中暗影牧师，刺伤了他的肩膀！")])],
                [statChangeCallback([-20, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "痛失良机|你并没有击中暗影牧师，反而被他邪恶的咒语抽取了部分力量！")])],

            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-2`, "受伤的暗影牧师", CHARA_IMGS["暗影牧师"], "暗影牧师努力挣扎起来开始吟唱。", null, null, null, EventType.SUBSEQUENT, "寻找掩体，伺机反击。", "吟唱；反射魔法"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.agility>=80)  && randomIntFromInterval(0,10)>=2) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-3`), buildBuff(BUFF.MESSAGE, "刺杀|你灵巧地躲过暗影牧师的法术，反身犹如闪电一般刺穿了他的喉咙！")])],
                [statChangeCallback([-50, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "躲闪不及|你被法术轰击的连连后退")])]
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.intelligence >= 150) && randomIntFromInterval(0,10)>=2 ) return 0;
                return 1;
                },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-3`),buildBuff(BUFF.TITLE, "反射魔法|反弹了法术的伤害"),buildBuff(BUFF.MESSAGE, "反射魔法|你准确的反弹了暗影牧师的魔法，他被魔法轰击的仿佛破布一般")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "躲闪不及|你被法术轰击的连连后退")])]
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-3`, "濒死的暗影牧师", CHARA_IMGS["暗影牧师"], "。。。", null, null, null, EventType.SUBSEQUENT, "搜索一番。。。", "离去。。。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,10)>=2 ) return 0;
                return 1;
            },
            [
                [statChangeCallback([-10, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "一无所获|你搜索了一番一无所获")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "神秘字条|cluexxx"),buildBuff(BUFF.MESSAGE, "神秘字条|你搜索了到了一串神秘的数字xxxxx")])],
            ]
        )
    ));

}

//
// function createLevel3BossEvents(allEvents) {
//
//     //boss example
//     const level = "3";
//     const id = "boss-" + level;
//     const name = "暗影牧师";
//     const boss = new Player(name, id);
//     const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["暗影牧师"], "城堡的尽头，一个黑暗中的身影伫立着。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");
//
//     //TODO: 这个logic是错的= =！
//     const preLogic = function (baseEvent) {
//         if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
//             baseEvent.choice1 = "使用不知何时得到的巨剑";
//         }
//     };
//
//     const leftCallback = () => {
//         if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
//             boss.power -= 50;
//         }
//     };
//
//     //Do nothing
//     const rightCallback = () => {
//     };
//     const winCheck = () => {
//         return player.power >= boss.power;
//     };
//
//     const leftWin = id + "-win";
//     const rightWin = id + "-win";
//     const leftLoss = id + "-loss";
//     const rightLoss = id + "-loss";
//
//     allEvents.push(createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss));
//     allEvents.push(createStatsChangeEvent(id + "-win", "", CHARA_IMGS["暗影牧师"], "没想到你又醒了，亦或你一直是醒着的。。。", "好吧", "。。。", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[level])], [buildBuff(BUFF.NEXT, STAGE_IDS[level])]));
//     allEvents.push(createStatsChangeEvent(id + "-loss", "", CHARA_IMGS["暗影牧师"], "就差一点，不过就此沉睡吧。。", "好吧", "", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第三关的试炼")], [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")]));
// }


function createLevel4BossEvents(allEvents) {

    const level = "4";
    const id = "boss-" + level;
    const name = "阿努比斯";
    const boss = new Player(name, id);

    // const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["阿努比斯"], "洞窟的深处，猩红色的眼睛正在凝视着你。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}`, "阿努比斯", CHARA_IMGS["阿努比斯"], "洞窟深处里的壁画上画着埃及的神，突然间壁画上的神明仿佛活过来一样。", null, null, null, EventType.BOSS, "什么！", "什么！"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
            ]
        ))
    );

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1`, "阿努比斯", CHARA_IMGS["阿努比斯"], "阿努比斯凝视着你，你感觉力量在不断流失。", null, null, null, EventType.SUBSEQUENT, "强行挣脱！", "强行挣脱！"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [randomStageChangeCallback2(50, 50), buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.TITLE, "死神凝视|你受到了死神的凝视。"), buildBuff(BUFF.MESSAGE, "死神凝视|随机属性-50。")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [randomStageChangeCallback2(50, 50), buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.TITLE, "死神凝视|你受到了死神的凝视。"), buildBuff(BUFF.MESSAGE, "死神凝视|随机属性-50。")])],
            ]
        )
    ));




    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1-1`, "阿努比斯", CHARA_IMGS["阿努比斯"], "阿努比斯吸收了你的力量，闪电般的向你攻击!", null, null, null, EventType.SUBSEQUENT, "全力闪躲。", "全力防御。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.agility>=100) && randomIntFromInterval(0,10)>=5) return 0;
                if (player.agility<100 ) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.TITLE, `身轻如燕|你灵巧的身法躲过了所有攻击。`),buildBuff(BUFF.MESSAGE, `身轻如燕|你在狂风暴雨般的攻击中，找到了完美的闪躲路径。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [statChangeCallback([-20, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你被阿努比斯的连续攻击打伤。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你在狂风暴雨般的攻击中，找到了相对安全的闪躲路径，但是还是被打伤了。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],

            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.power>=100) && randomIntFromInterval(0,10)>=5) return 0;
                if (player.power<100 ) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.TITLE, `以力破巧|蛮力有时候是很有效的。`),buildBuff(BUFF.MESSAGE, `以力破巧|你强大的力量直接把阿努比斯打飞了出去。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [statChangeCallback([-20, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你被阿努比斯的连续攻击打伤。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你在狂风暴雨般的攻击中，与他对拼了几个回合，但是还是被打伤了。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],

            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-1`, "阿努比斯", CHARA_IMGS["阿努比斯"], "远处的阿努比斯似乎在谋划着什么。", null, null, null, EventType.SUBSEQUENT, "吟唱魔法。", "速攻。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 130 && randomIntFromInterval(0,10)>=7) return 0;
                if (player.intelligence >= 130 && randomIntFromInterval(0,10)<4) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "流星火雨|你的魔法重创了阿努比斯。"),buildBuff(BUFF.TITLE, "流星火雨|你成功施展了火系魔法流星火雨。")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "雷霆万钧|你的魔法重创了阿努比斯。"),buildBuff(BUFF.TITLE, "雷霆万钧|你成功施展了雷系魔法雷霆万钧。")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "在劫难逃|你没有成功施展魔法，被阿努比斯直接命中，死在了洞窟里。"),buildBuff(BUFF.TITLE, "在劫难逃|危险降临。"),buildBuff(BUFF.DEATH, 'dead-1')])]
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.agility >= 130 && randomIntFromInterval(0,10)>=5) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "速攻|你连续攻击阿努比斯，多次命中了他的要害！"),buildBuff(BUFF.MESSAGE, "速攻|你的攻势如同波浪连绵不绝！")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "在劫难逃|你的速攻没有奏效，被阿努比斯直接命中，死在了洞窟里。"),buildBuff(BUFF.TITLE, "在劫难逃|危险降临。"),buildBuff(BUFF.DEATH, 'dead-1')])]
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-2`, "受伤的阿努比斯", CHARA_IMGS["阿努比斯"], "你要是就此停手，我可以给你个宝物。", null, null, null, EventType.SUBSEQUENT, "见好就收。", "趁胜追击。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,100)<2) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "神秘字条|cluexxx"), buildBuff(BUFF.MESSAGE, "神秘字条|阿努比斯给你了一串神秘数字xxx")])],
                [statChangeCallback([50, 50, 50, 50, 50, 0]),buffCallback([buildBuff(BUFF.MESSAGE, "洞窟秘宝|全属性+50。"),buildBuff(BUFF.TITLE, "洞窟秘宝|你获得了神秘的宝藏。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]

            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [randomStageChangeCallback2(50, 50),buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`), buildBuff(BUFF.TITLE, "死神凝视|随机属性-50"), buildBuff(BUFF.TITLE, "死神凝视|阿努比斯偷偷的又对你使用了死神凝视。")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-1`, "受伤的阿努比斯", CHARA_IMGS["阿努比斯"], "阿努比斯似乎在蓄力。", null, null, null, EventType.SUBSEQUENT, "速攻。", "蓄力攻击。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.agility >= 130 && randomIntFromInterval(0,10)>=1) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-4-1`), buildBuff(BUFF.TITLE, "壁画|阿努比斯被你击中后，突然又变成了洞窟里的壁画，仿佛从来没有存在过一般"), buildBuff(BUFF.TITLE, "壁画|真的吗？假的吗？梦境，亦或现实？")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "在劫难逃|你的速攻没有奏效，被阿努比斯直接命中，死在了洞窟里。"),buildBuff(BUFF.TITLE, "在劫难逃|危险降临。"),buildBuff(BUFF.DEATH, 'dead-1')])]

            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.power >= 130 && randomIntFromInterval(0,10)>=1) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-4-1`), buildBuff(BUFF.TITLE, "壁画|阿努比斯被你击中后，突然又变成了洞窟里的壁画，仿佛从来没有存在过一般"), buildBuff(BUFF.TITLE, "壁画|真的吗？假的吗？梦境，亦或现实？")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "在劫难逃|你的蓄力攻击没有奏效，被阿努比斯直接命中，死在了洞窟里。"),buildBuff(BUFF.TITLE, "在劫难逃|危险降临。"),buildBuff(BUFF.DEATH, 'dead-1')])]

            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-4-1`, "洞窟", CHARA_IMGS["洞窟"], "幽暗的洞窟里似乎空荡荡的。", null, null, null, EventType.SUBSEQUENT, "再搜索一番。", "离去。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,100)<=2) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "神秘壁画|cluexxx"), buildBuff(BUFF.MESSAGE, "神秘壁画|你在壁画上找到一串神秘数字xxx")])],
                [statChangeCallback([-20, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.TITLE, "一无所获|什么都没有找到。"),buildBuff(BUFF.MESSAGE, "一无所获|你在洞窟里什么都没有找到。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]

            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-4-1`), buildBuff(BUFF.TITLE, "壁画|阿努比斯被你击中后，突然又变成了洞窟里的壁画，仿佛从来没有存在过一般"), buildBuff(BUFF.TITLE, "壁画|真的吗？假的吗？梦境，亦或现实？")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "离去|你缓缓离开了洞窟。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]

            ]
        )
    ));
}








function createLevel5BossEvents(allEvents) {

    const level = "5";
    const id = "boss-" + level;
    const name = "古树之神";
    const boss = new Player(name, id);

    // player.goodness = 20;
    player.goodness = 40;
    // player.goodness = 60;
    // player.goodness = 80;
    console.error("player.goodness = " + player.goodness);

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}`, "古老的大树", CHARA_IMGS["古树之神"], "一颗古老的大树，从树皮看，大概有几千岁了。", null, null, null, EventType.BOSS, "走近看看。", "走近看看。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.goodness <= 25) return 2;
                if (player.goodness <= 50) return 1;
                if (player.goodness <= 100) return 0;
            },
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-2`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-3`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.goodness <= 25) return 2;
                if (player.goodness <= 50) return 1;
                if (player.goodness <= 100) return 0;
            },
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-2`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-3`)])],
            ]
        ))
    );

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1`, "和蔼的大树", CHARA_IMGS["古树之神"], "你是个善良的人，大自然会保佑你。", null, null, null, EventType.SUBSEQUENT, "多谢！", "谢谢，不过我独来独往，并不需要。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [randomStageChangeCallback1(50, 50), buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "大自然的祝福|善有善报，你活得了大自然的祝福"), buildBuff(BUFF.MESSAGE, "大自然的祝福|随机属性+50。")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.MESSAGE, "放弃|你放弃了古树给你的祝福。")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2`, "神秘的大树", CHARA_IMGS["古树之神"], "我觉得你并被大奸大恶之人，不过你依旧要经过一个小小的试炼。。。", null, null, null, EventType.SUBSEQUENT, "什么试炼？", "什么试炼？"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-1`, "树人小兵", CHARA_IMGS["树人小兵"], "这是大自然对你的试炼, 放马过来吧！", null, null, null, EventType.SUBSEQUENT, "使用魔法", "使用兵器"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 30) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "魔法伤害|你的魔法击破了树人的防御！")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.power >= 40) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "物理伤害|你的武器击破了树人的防御！")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-2`, "神秘的大树", CHARA_IMGS["古树之神"], "你完成了试炼，你可以离开这片森林了。。。", null, null, null, EventType.SUBSEQUENT, "好的。。。", "好的。。。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "大自然的试炼|完成了大自然的试炼")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "大自然的试炼|完成了大自然的试炼")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3`, "愤怒的大树", CHARA_IMGS["古树之神"], "我不喜欢你身上的邪气，你不可以离开这片森林，接受大自然的愤怒吧！", null, null, null, EventType.SUBSEQUENT, "什么？", "什么？"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-1`, "树人小兵", CHARA_IMGS["树人小兵"], "接受大自然的制裁吧！", null, null, null, EventType.SUBSEQUENT, "使用魔法", "使用兵器"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 35) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-2`)])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.power >= 45) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-2`)])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-death-1`, "自然之怒", CHARA_IMGS["树人小兵"], "你的攻击没有奏效，却被树人的魔法击穿了头颅！", null, null, null, EventType.SUBSEQUENT, "。。。", "。。。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-1'")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-1'")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-2`, "愤怒的大树", CHARA_IMGS["古树之神"], "有两下子，不过你是过不了我这一关的！", null, null, null, EventType.SUBSEQUENT, "使用魔法", "使用兵器"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 50) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level])])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-2`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.power >= 60) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level])])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-2`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-death-2`, "自然之盛怒", CHARA_IMGS["古树之神"], "大树的枝叶疯狂生长，将你包围起来，你无法动弹。。。", null, null, null, EventType.SUBSEQUENT, "就这样结束了吗？", "就这样结束了吗？"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-4'")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-4'")])],
            ]
        )
    ));
}






function createLevel6BossEvents(allEvents) {

    const level = "6";
    const id = "boss-" + level;
    const name = "怨恨的女妖";

    // player.goodness = 20;
    player.goodness = 40;
    // player.goodness = 60;
    // player.goodness = 80;
    console.error("player.goodness = " + player.goodness);

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}`, "怨恨的女妖", CHARA_IMGS["女王"], "悬崖的巅峰上，你看到了一个傲立的身影。。", null, null, null, EventType.BOSS, "爬上去看看。", "爬上去看看。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.goodness <= 25) return 0;
                if (player.goodness <= 50) return 1;
                if (player.goodness <= 100) return 2;
            },
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-2`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-3`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.goodness <= 25) return 0;
                if (player.goodness <= 50) return 1;
                if (player.goodness <= 100) return 2;
            },
            [
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-2`)])],
                [statChangeCallback([0, 0, 0, 0, 0, 0]), buffCallback([buildBuff(BUFF.NEXT, `${id}-3`)])],
            ]
        ))
    );

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1`, "怨恨的女妖", CHARA_IMGS["女王"], "你跟那些伪善的冒险家不一样，我可以送你一个宝物。", null, null, null, EventType.SUBSEQUENT, "多谢！", "谢谢，并不需要。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([0, 0, 0, 0, 100, 0]), buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "女妖的魔法书|女妖送你了一本魔法书"), buildBuff(BUFF.MESSAGE, "女妖的魔法书|智力+100。")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,100)<=3) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.MESSAGE, "放弃|你放弃了女妖的宝物。"),buildBuff(BUFF.MESSAGE, "神秘的书信|女妖：有意思，这个就给你了。书信上显示着神秘的数字xxx。"),buildBuff(BUFF.MESSAGE, "神秘的书信|cluexxx。")])],
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.MESSAGE, "放弃|你放弃了女妖的宝物。")])],

            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2`, "怨恨的女妖", CHARA_IMGS["女妖"], "亦正亦邪的冒险家，还挺有个个性，不过要是实力不够还是的会长眠于此！", null, null, null, EventType.SUBSEQUENT, "什么？", "什么？"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-1`, "骷髅兵", CHARA_IMGS["女王"], "四周涌上了一批骷髅！", null, null, null, EventType.SUBSEQUENT, "吟唱：暴风雪", "战技：剑刃风暴"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 230) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "暴风雪|你的魔法击散了很多骷髅！"),buildBuff(BUFF.TITLE, "暴风雪|强大的冰系魔法，宛如冰龙的咆哮一般！")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`),buildBuff(BUFF.MESSAGE, "在劫难逃|你被无数的骷髅团团包围，力竭而死！")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.power >= 240) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-2-2`), buildBuff(BUFF.MESSAGE, "剑刃风暴|你使用了剑刃风暴，如同秋风扫落叶一般击溃了骷髅！"),buildBuff(BUFF.TITLE, "剑刃风暴|强大的武技擅长对付成片的敌人！")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-2`, "怨恨的女妖", CHARA_IMGS["女王"], "没想到还有点本事，你可以走了。。。", null, null, null, EventType.SUBSEQUENT, "好的。。。", "好的。。。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "擦肩而过|与女妖擦肩而过")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.TITLE, "擦肩而过|与女妖擦肩而过")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3`, "愤怒的女妖", CHARA_IMGS["女王"], "我最讨厌你们这些伪君子！", null, null, null, EventType.SUBSEQUENT, "什么？", "什么？"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-1`, "骷髅", CHARA_IMGS["女王"], "呜噜呜噜！", null, null, null, EventType.SUBSEQUENT, "使用魔法", "使用兵器"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 135) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-2`)])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.power >= 145) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-2`)])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-1`)])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-death-1`, "阴魂不散", CHARA_IMGS["女王"], "你的攻击没有奏效，被骷髅围殴致死！", null, null, null, EventType.SUBSEQUENT, "。。。", "。。。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-1'")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-1'")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-2`, "愤怒的女妖", CHARA_IMGS["女王"], "有两下子，不过你是过不了我这一关的！", null, null, null, EventType.SUBSEQUENT, "吟唱：审判", "禁咒：圣光降世"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 250) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]),buildBuff(BUFF.MESSAGE, "审判|你使用出光系高级魔法审判，直接把女妖贯穿"),buildBuff(BUFF.TITLE, "审判|光系高级魔法"),buildBuff(BUFF.TITLE, "女妖杀手|杀死了女妖")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-2`)])],
            ]
        ),
        // && randomIntFromInterval(0,100)< 5
    new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 360 ) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, ${id}-4-1),buildBuff(BUFF.MESSAGE, "圣光降世|你使用出光系禁咒，圣光直接把女妖融化"),buildBuff(BUFF.TITLE, "圣光降世|光系禁咒，仿佛天国降临一般"),buildBuff(BUFF.TITLE, "女妖杀手|杀死了女妖")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-death-2`)])],
            ]
        )
    ));


    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-4-1`, "悬崖", CHARA_IMGS["悬崖"], "空荡荡的悬崖上只有嶙峋的怪石。", null, null, null, EventType.SUBSEQUENT, "四处看看。", "继续前行。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,100)< 5 ) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.MESSAGE, "神秘文字|你在岩石上发现了神秘文字XXX"), buildBuff(BUFF.TITLE, "神秘文字|cluexxx")])],
                [statChangeCallback([-20, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.MESSAGE, "空手而归|你找寻了半天没有发现任何宝物")])],


            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.NEXT, STAGE_IDS[level]), buildBuff(BUFF.MESSAGE, "离去|你从悬崖上起身离去。")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-death-2`, "亡灵诅咒", CHARA_IMGS["女王"], "你中了女妖的诅咒，感觉浑身软弱无力，被女妖轻易的洞穿了心脏。。。", null, null, null, EventType.SUBSEQUENT, "就这样结束了吗？", "就这样结束了吗？"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-4'")])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [buffCallback([buildBuff(BUFF.DEATH, "'dead-4'")])],
            ]
        )
    ));
}



function createLevel7BossEvents(allEvents) {

    const level = "7";
    const id = "boss-" + level;
    const name = "九头蛇";
    const boss = new Player(name, id);

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}`, "九头蛇", CHARA_IMGS["九头蛇"], "沼泽的深处，隐藏着远古的魔物，黑暗中的眼睛反射出来的寒芒仿佛星星点点。。", null, null, null, EventType.BOSS, "探索一下。", "缓缓退去。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([-30, 0, 0, 0, 0, 0]),buildBuff(BUFF.MESSAGE, `你刚准备走近就被九头蛇咬住拖进了沼泽深处！`), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([-30, 0, 0, 0, 0, 0]),buildBuff(BUFF.MESSAGE, `你刚准备离开，就被九头蛇咬住拖进了沼泽深处！`), buffCallback([buildBuff(BUFF.NEXT, `${id}-1`)])],
            ]
        ))
    );

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1`, "沼泽", CHARA_IMGS["沼泽"], "你被九头蛇在向沼泽深处拖拽，感觉力量在不断流失！", null, null, null, EventType.SUBSEQUENT, "强行挣脱！", "借力挣脱！"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,10)>=2) return 0;
                return 1;
            },
            [
                [randomStageChangeCallback2(30, 30), buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.TITLE, "侥幸|你侥幸挣脱了九头蛇的撕咬。"), buildBuff(BUFF.MESSAGE, "流血|随机属性-30。")])],
                [buildBuff(BUFF.NEXT, `${id}-death-1`),buildBuff(BUFF.MESSAGE, "在劫难逃|你并没有挣脱九头蛇的攻击，力竭而死！")],

            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (randomIntFromInterval(0,10)>=2) return 0;
                return 1;
            },
            [
                [randomStageChangeCallback2(30, 30), buffCallback([buildBuff(BUFF.NEXT, '${id}-1-1'), buildBuff(BUFF.TITLE, "侥幸|你侥幸挣脱了九头蛇的撕咬。"), buildBuff(BUFF.MESSAGE, "流血|随机属性-30。")])],
                [buildBuff(BUFF.NEXT, `${id}-death-1`),buildBuff(BUFF.MESSAGE, "在劫难逃|你并没有挣脱九头蛇的攻击，力竭而死！")],
            ]
        )
    ));




    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1-1`, "九头蛇", CHARA_IMGS["九头蛇"], "九头蛇从多个方向向你咬了过来", null, null, null, EventType.SUBSEQUENT, "全力闪躲。", "全力防御。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.agility>=200) && randomIntFromInterval(0,10)>=5) return 0;
                if (player.agility<200 ) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.TITLE, `身轻如燕|你灵巧的身法躲过了所有攻击。`),buildBuff(BUFF.MESSAGE, `身轻如燕|你在狂风暴雨般的攻击中，找到了完美的闪躲路径。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [statChangeCallback([-50, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你被九头蛇的连续攻击打伤。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [statChangeCallback([-10, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你在狂风暴雨般的攻击中，找到了相对安全的闪躲路径，但是还是被打伤了。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],

            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.power>=200) && randomIntFromInterval(0,10)>=5) return 0;
                if (player.power<200 ) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.TITLE, `以力破巧|蛮力有时候是很有效的。`),buildBuff(BUFF.MESSAGE, `铜墙铁壁|你牢牢的防御住了九头蛇所有的攻击。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [statChangeCallback([-50, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你被九头蛇的连续攻击打伤。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],
                [statChangeCallback([-10, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, `负伤|你在狂风暴雨般的攻击中，与他对拼了几个回合，但是还是被打伤了。`),buildBuff(BUFF.NEXT, `${id}-2-1`)])],

            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-2-1`, "九头蛇", CHARA_IMGS["九头蛇"], "你好不容易跳出了九头蛇的攻击圈。", null, null, null, EventType.SUBSEQUENT, "吟唱：火系魔法魔法。", "吟唱：冰系魔法。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 130 && randomIntFromInterval(0,10)>=9) return 0;
                if (player.intelligence >= 130 && randomIntFromInterval(0,10)<2) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`), buildBuff(BUFF.MESSAGE, "地狱烈炎|你的魔法重创了九头蛇。"),buildBuff(BUFF.TITLE, "地狱烈炎|火系高级魔法，成片的火海。")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "火球|你的魔法似乎没有造成什么伤害。")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "连珠火球|你的魔法击伤了九头蛇。"),buildBuff(BUFF.TITLE, "连珠火球|火系魔法，连续的火球不断攻击。"),buildBuff(BUFF.DEATH, '${id}-1-2')])]
            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if (player.intelligence >= 130 && randomIntFromInterval(0,10)>=9) return 0;
                if (player.intelligence >= 130 && randomIntFromInterval(0,10)<2) return 1;
                return 2;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-1-2`), buildBuff(BUFF.MESSAGE, "暴风雪|你施展了冰系高级魔法，击伤了九头蛇！"),buildBuff(BUFF.TITLE, "暴风雪|强大的冰系魔法，宛如冰龙的咆哮一般！")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "冰墙|你的魔法似乎没有造成什么伤害！")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-1-1`), buildBuff(BUFF.MESSAGE, "冰环|你的魔法似乎没有造成什么伤害！")])],
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-1-2`, "受伤的九头蛇", CHARA_IMGS["九头蛇"], "九头蛇似乎在吟唱魔法。", null, null, null, EventType.SUBSEQUENT, "技能：疾风乱舞。", "技能：一闪。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.agility>=300)) return 0;
                return 1;
            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`), buildBuff(BUFF.MESSAGE, "疾风乱舞|你的攻击仿佛疾风一样，把九头蛇打得千疮百孔"), buildBuff(BUFF.TITLE, "疾风乱舞|高级武技，风暴般的连续攻击。")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "在劫难逃|你刚要施展疾风乱舞，就被九头蛇的魔法击中，直接变成了碎片"),buildBuff(BUFF.DEATH, '${id}-1-1')])]

            ]
        ),
        new AdvancedEventAttrsV2(
            () => {
                if ((player.agility>=400) && randomIntFromInterval(0,10)>=3 ) return 0;
                if ((player.agility>=400) ) return 1;
                return 2;

            },
            [
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-4-1`), buildBuff(BUFF.MESSAGE, "一闪|你集中精神，使用出一闪，虽是后发，确实先至，直接斩下了九头蛇的所有蛇头！"), buildBuff(BUFF.TITLE, "一闪|终极武技，仿佛天地为之变色的斩击。")])],
                [buffCallback([buildBuff(BUFF.NEXT, `${id}-3-1`), buildBuff(BUFF.MESSAGE, "一闪|你使用出了一闪，重创了九头蛇"), buildBuff(BUFF.TITLE, "一闪|终极武技，仿佛天地为之变色的斩击。")])],
                [buffCallback([buildBuff(BUFF.MESSAGE, "在劫难逃|你刚要施展一闪，就被九头蛇的魔法击中，直接变成了碎片"),buildBuff(BUFF.DEATH, '${id}-1-1')])]

            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-3-1`, "受伤的九头蛇", CHARA_IMGS["九头蛇"], "九头蛇仓皇而逃，留下空荡荡的沼泽。", null, null, null, EventType.SUBSEQUENT, "搜索一番。", "搜索一番。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([50, 50, 50, 50, 50, 0]),buffCallback([buildBuff(BUFF.MESSAGE, "九头蛇的宝藏|全属性+50。"),buildBuff(BUFF.TITLE, "九头蛇的宝藏|你获得了九头蛇的宝藏。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]

            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([50, 50, 50, 50, 50, 0]),buffCallback([buildBuff(BUFF.MESSAGE, "九头蛇的宝藏|全属性+50。"),buildBuff(BUFF.TITLE, "九头蛇的宝藏|你获得了九头蛇的宝藏。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]
            ]
        )
    ));

    allEvents.push(createAdvancedEventV2(
        new EventV2(`${id}-4-1`, "沼泽", CHARA_IMGS["沼泽"], "沼泽里似乎空空如也。", null, null, null, EventType.SUBSEQUENT, "搜索一番。", "离去。"),
        new StartCondition(2, null, null),
        new AdvancedEventAttrsV2(
            () => {
                if ( randomIntFromInterval(0,10)>=2 ) return 0;
                return 1;

            },
            [
                [buffCallback([buildBuff(BUFF.MESSAGE, "神秘字条|你发现一个神秘的字条：xxxx。"),buildBuff(BUFF.TITLE, "神秘字条|cluexxx。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])],
                [statChangeCallback([-10, 0, 0, 0, 0, 0]),buffCallback([buildBuff(BUFF.MESSAGE, "空空如也|你搜索了半天没有发现有用的东西。"),buildBuff(BUFF.MESSAGE, "离去|你从沼泽缓缓离去。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]

            ]
        ),
        new AdvancedEventAttrsV2(
            null,
            [
                [statChangeCallback([50, 50, 50, 50, 50, 0]),buffCallback([buildBuff(BUFF.MESSAGE, "九头蛇的宝藏|你在离开的路上竟然发现九头蛇隐藏的宝藏。"),buildBuff(BUFF.MESSAGE, "九头蛇的宝藏|全属性+50。"),buildBuff(BUFF.TITLE, "九头蛇的宝藏|你获得了九头蛇的宝藏。"),buildBuff(BUFF.NEXT, STAGE_IDS[level])])]
            ]
        )
    ));

}
//
//
//
// function createLevel7BossEvents(allEvents, level) {
//
//     //boss example
//     const id = "boss-" + level;
//     const name = "暗影牧师";
//     const boss = new Player(name, id);
//     const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["九头蛇"], "沼泽的深处，隐藏着远古的魔物。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");
//
//     //TODO: 这个logic是错的= =！
//     const preLogic = function (baseEvent) {
//         if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
//             baseEvent.choice1 = "使用不知何时得到的巨剑";
//         }
//     };
//
//     const leftCallback = () => {
//         if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
//             boss.power -= 50;
//         }
//     };
//
//     //Do nothing
//     const rightCallback = () => {
//     };
//     const winCheck = () => {
//         return player.power >= boss.power;
//     };
//
//     const leftWin = id + "-win";
//     const rightWin = id + "-win";
//     const leftLoss = id + "-loss";
//     const rightLoss = id + "-loss";
//
//     allEvents.push(createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss));
//     allEvents.push(createStatsChangeEvent(id + "-win", "", CHARA_IMGS["九头蛇"], "没想到你又醒了，亦或你一直是醒着的。。。", "好吧", "。。。", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[level])], [buildBuff(BUFF.NEXT, STAGE_IDS[level])]));
//     allEvents.push(createStatsChangeEvent(id + "-loss", "", CHARA_IMGS["九头蛇"], "就差一点，不过就此沉睡吧。。", "好吧", "", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第三关的试炼")], [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")]));
// }
//
// function createLevel8BossEvents(allEvents, level) {
//
//     //boss example
//     const id = "boss-" + level;
//     const name = "美杜莎";
//     const boss = new Player(name, id);
//     const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["美杜莎"], "光滑的冰壁之中，封印着一个美丽的女子，突然她好像苏醒一般，猛的睁开了眼睛。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");
//
//     //TODO: 这个logic是错的= =！
//     const preLogic = function (baseEvent) {
//         if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
//             baseEvent.choice1 = "使用不知何时得到的巨剑";
//         }
//     };
//
//     const leftCallback = () => {
//         if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
//             boss.power -= 50;
//         }
//     };
//
//     //Do nothing
//     const rightCallback = () => {
//     };
//     const winCheck = () => {
//         return player.power >= boss.power;
//     };
//
//     const leftWin = id + "-win";
//     const rightWin = id + "-win";
//     const leftLoss = id + "-loss";
//     const rightLoss = id + "-loss";
//
//     allEvents.push(createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss));
//     allEvents.push(createStatsChangeEvent(id + "-win", "", CHARA_IMGS["美杜莎"], "没想到你又醒了，亦或你一直是醒着的。。。", "好吧", "。。。", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[level])], [buildBuff(BUFF.NEXT, STAGE_IDS[level])]));
//     allEvents.push(createStatsChangeEvent(id + "-loss", "", CHARA_IMGS["美杜莎"], "就差一点，不过就此沉睡吧。。", "好吧", "", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第三关的试炼")], [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")]));
// }


function createLevel9BossEvents(allEvents, level) {

    //boss example
    const id = "boss-" + level;
    const name = "暗影牧师";
    const boss = new Player(name, id);
    const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["炎魔"], "岩浆深处不断翻滚，渐渐显现出一个山峰似的炎魔。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");

    //TODO: 这个logic是错的= =！
    const preLogic = function (baseEvent) {
        if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
            baseEvent.choice1 = "使用不知何时得到的巨剑";
        }
    };

    const leftCallback = () => {
        if (player.buffSet.has(buildBuff(BUFF.BUFF, "腐朽的巨剑"))) {
            boss.power -= 50;
        }
    };

    //Do nothing
    const rightCallback = () => {
    };
    const winCheck = () => {
        return player.power >= boss.power;
    };

    const leftWin = id + "-win";
    const rightWin = id + "-win";
    const leftLoss = id + "-loss";
    const rightLoss = id + "-loss";

    allEvents.push(createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss));
    allEvents.push(createStatsChangeEvent(id + "-win", "", CHARA_IMGS["炎魔"], "没想到你又醒了，亦或你一直是醒着的。。。", "好吧", "。。。", "1", EventType.SUBSEQUENT, null,
        [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, STAGE_IDS[level])], [buildBuff(BUFF.NEXT, STAGE_IDS[level])]));
    allEvents.push(createStatsChangeEvent(id + "-loss", "", CHARA_IMGS["炎魔"], "就差一点，不过就此沉睡吧。。", "好吧", "", "1", EventType.SUBSEQUENT, null,
        [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第三关的试炼")], [buildBuff(BUFF.DEATH, 'dead-1'), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")]));
}

//
// function createLevel9BossEvents(allEvents) {
//
//     //boss example
//     const id = "boss-9";
//     const name = "亚当(84757)";
//     const boss = new Player(name, id);
//     const baseEvent = new EventV2(id, boss.name, CHARA_IMGS["亚当"], "看不清面孔的人向这边袭来。。", 1, null, null, EventType.BOSS, "赤手空拳搏斗", "力有不逮，暂时撤退。");
//
//     const preLogic = function (baseEvent) {
//         if (player.buffSet.has(BUFF.BUFF + ":腐朽的巨剑")) {
//             baseEvent.choice1 = "使用不知何时得到的巨剑";
//         }
//     };
//
//     const leftCallback = () => {
//         if (player.buffSet.has(BUFF.BUFF + ":腐朽的巨剑")) {
//             boss.power -= 50;
//         }
//     };
//
//     //Do nothing
//     const rightCallback = () => {
//     };
//     const winCheck = () => {
//         return player.power >= boss.power;
//     };
//
//     const leftWin = id + "-win";
//     const rightWin = id + "-win";
//     const leftLoss = id + "-loss";
//     const rightLoss = id + "-loss";
//
//     allEvents.push(createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss));
//     allEvents.push(createStatsChangeEvent(id + "-win", "", CHARA_IMGS["亚当"], "（微笑）你赢了，你的力量比我强大，不过后面更难的试炼在等待着你。。。", "好吧", "。。。", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.NEXT, "end-1")], [buildBuff(BUFF.NEXT, "end-1")]));
//     allEvents.push(createStatsChangeEvent(id + "-loss", "", CHARA_IMGS["亚当"], "就差一点，或许, 有武器就能赢了。。", "好吧", "", "1", EventType.SUBSEQUENT, null,
//         [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], null, [buildBuff(BUFF.DEATH, 600), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")], [buildBuff(BUFF.DEATH, 600), buildBuff(BUFF.TITLE, "出师未捷身先死|没有通过第一关的试炼")]));
// }

function createBossEvent(baseEvent, preLogic, winCheck, leftCallback, rightCallback, leftWin, leftLoss, rightWin, rightLoss) {
    console.log("createBossEvent");

    const leftLogic = function () {
        leftCallback();
        if (winCheck()) {
            addNextEventBuff(rightWin);
        } else {
            addNextEventBuff(rightLoss);
        }
    };

    const rightLogic = function () {
        rightCallback();
        if (winCheck()) {
            addNextEventBuff(leftWin);
        } else {
            addNextEventBuff(leftLoss);
        }
    };

    preLogic(baseEvent);

    return new EventV2(baseEvent.id, baseEvent.name, baseEvent.img, baseEvent.line, baseEvent.startStage, baseEvent.startAchievement, baseEvent.startBuff, EventType.BOSS,
        new Choice(baseEvent.id, baseEvent.choice1,
            new EffectV2(baseEvent.id, EffectType.COMPOSITE, leftLogic)
        ),
        new Choice(baseEvent.id, baseEvent.choice2,
            new EffectV2(baseEvent.id, EffectType.COMPOSITE, rightLogic)
        ),
        null);
}

function createAdvancedEvent(baseEvent, startCondition, advancedEventAttrs) {
    return new EventV2(baseEvent.id, baseEvent.name, baseEvent.img, baseEvent.line,
        startCondition.startStage, startCondition.startAchievement, startCondition.startBuff, baseEvent.eventType,
        new Choice(baseEvent.id, baseEvent.choice1,
            createStatsEffect(baseEvent.id, advancedEventAttrs.statChangeDuo1[0], advancedEventAttrs.buffDuo1[0],
                advancedEventAttrs.condition1, advancedEventAttrs.statChangeDuo1[1], advancedEventAttrs.buffDuo1[1])
        ),
        new Choice(baseEvent.id, baseEvent.choice2,
            createStatsEffect(baseEvent.id, advancedEventAttrs.statChangeDuo2[0], advancedEventAttrs.buffDuo2[0],
                advancedEventAttrs.condition2, advancedEventAttrs.statChangeDuo2[1], advancedEventAttrs.buffDuo2[1])
        ),
        null);
}

// 可以多结局，instead of 2， 例如 智力0-20， 20-40， 40-60， 60-80， 可能是5个不同的事件
function createAdvancedEventV2(baseEvent, startCondition, v2AdvancedEventAttrs1, v2AdvancedEventAttrs2) {
    return new EventV2(baseEvent.id, baseEvent.name, baseEvent.img, baseEvent.line,
        startCondition.startStage, startCondition.startAchievement, startCondition.startBuff, baseEvent.eventType,
        new Choice(baseEvent.id, baseEvent.choice1,
            createAdvancedEffect(baseEvent.id, v2AdvancedEventAttrs1.condition, v2AdvancedEventAttrs1.callBackSeqs)
        ),
        new Choice(baseEvent.id, baseEvent.choice2,
            createAdvancedEffect(baseEvent.id, v2AdvancedEventAttrs2.condition, v2AdvancedEventAttrs2.callBackSeqs)
        ),
        null);
}

function noop(){}

function statChangeCallback(statsChange) {
    if (statsChange !== undefined && statsChange !== null) {
        return () => {
            player.spirit += statsChange[0];
            player.gold += statsChange[1];
            player.power += statsChange[2];
            player.agility += statsChange[3];
            player.intelligence += statsChange[4];
            player.goodness += statsChange[5];
        };
    }
    return noop;
}
//random add
function randomStageChangeCallback1(min, max) {
    return () => {
        const attr = ATTRS[Math.floor(Math.random() * ATTRS.length)];
        player[attr] += randomIntFromInterval(min, max);
    };
}
//random minus
function randomStageChangeCallback2(min, max) {
    return () => {
        const attr = ATTRS[Math.floor(Math.random() * ATTRS.length)];
        player[attr] += randomIntFromInterval(min, max);
    };
}

function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function buffCallback(buffs) {
    if (buffs !== undefined && buffs !== null) {
        return () => {
            buffs.forEach((buff) => {
                player.buffSet.add(buff)
            });
        }
    }
    return noop;
}

function createAdvancedEffect(eventId, conditionCheck, callBackSeqs) {
    const outerCallBack = function () {

        let checkPass = 0;
        if (conditionCheck !== null && conditionCheck !== undefined) {
            checkPass = conditionCheck();
        }

        let idx = 0;
        callBackSeqs.forEach(
            (callBackSeq) => {
                console.error("callBackSeq:");
                console.error(callBackSeq);
                if (checkPass === idx) {
                    callBackSeq.forEach(
                        (callBack) => {
                            callBack();
                        }
                    )
                }
                idx++;
            }
        );
    };
    return new EffectV2(eventId, EffectType.STATS_CHANGE, outerCallBack);
}

// function to create a event with both effects are stats change event
// V1 -> V2 的普通event的utility，用的input还是V1的input
function createStatsChangeEvent(id, name, img, line, posLine, negLine, stage, type, achievement, leftAttrEffects, rightAttrEffects, startBuff, leftBuffs, rightBuffs) {
    return new EventV2(id, name, img, line, stage, null, startBuff, type,
        new Choice(id, posLine,
            createStatsEffect(id, leftAttrEffects, leftBuffs)
        ),
        new Choice(id, negLine,
            createStatsEffect(id, rightAttrEffects, rightBuffs)
        ),
        null);
}

function createStatsEffect(eventId, attrChange, buffs, conditionCheck, attrChange1, buffs1) {
    const callBack = function () {

        let checkPass = true;
        if (conditionCheck !== null && conditionCheck !== undefined) {
            checkPass = conditionCheck();
        }

        if (checkPass) {
            if (attrChange !== undefined && attrChange !== null) {
                player.spirit += attrChange[0];
                player.gold += attrChange[1];
                player.power += attrChange[2];
                player.agility += attrChange[3];
                player.intelligence += attrChange[4];
                player.goodness += attrChange[5];
            }
            if (buffs !== undefined && buffs !== null) {
                buffs.forEach((buff) => {
                    player.buffSet.add(buff)
                });
            }
        } else {
            if (attrChange1 !== undefined && attrChange1 !== null) {
                player.spirit += attrChange1[0];
                player.gold += attrChange1[1];
                player.power += attrChange1[2];
                player.agility += attrChange1[3];
                player.intelligence += attrChange1[4];
                player.goodness += attrChange1[5];
            }
            if (buffs1 !== undefined && buffs1 !== null) {
                buffs1.forEach((buff) => {
                    player.buffSet.add(buff)
                });
            }
        }
    };
    return new EffectV2(eventId, EffectType.STATS_CHANGE, callBack);
}

function convertConsecutiveEventJsonToEvents(json) {
    const consecEvents = [];
    for (let i = 0; i < json.length; i++) {
        const eventJson = json[i];
        const event = createConsecutiveEvent(eventJson);
        consecEvents.push(event);
    }
    return consecEvents;
}

//TODO: StartBuff
function createConsecutiveEvent(eventJson) {
    const startStage = eventJson.startStage === "" ? null : eventJson.startStage;
    const startAchievement = eventJson.startAchievement === ""
        ? ""
        : parseListAttr(eventJson.startAchievement)[0];
    console.error(startAchievement);
    return new EventV2(eventJson.id, eventJson.name, eventJson.img, eventJson.text, startStage, startAchievement, null, EventType.NORMAL, createChoice(eventJson, true), createChoice(eventJson, false), null);
}

function createChoice(eventJson, isChoice1) {
    const effectType = isChoice1 ? eventJson.effect1Type : eventJson.effect2Type;
    if (effectType === "noChange") {
        return createNoopChoice(eventJson, isChoice1);
    } else if (effectType === "buff") {
        return createBuffChoice(eventJson, isChoice1);
    } else if (effectType === "statsConditional") {
        return createStatsConditionalChoice(eventJson, isChoice1);
    } else if (effectType === "death") {
        return createBuffChoice(eventJson, isChoice1);
    } else {
        console.error("Cannot create choice for");
        console.error(eventJson);
    }
}

function createStatsConditionalChoice(eventJson, isChoice1) {
    if (isChoice1) {
        return new Choice(eventJson.id, eventJson.choice1,
            new EffectV2(eventJson.id, EffectType.STATS_COND, function () {
                const conditions = parseListAttr(eventJson.choice1Condition);
                let nextEventBuff;
                if (comparePlayerStats(conditions)) {
                    nextEventBuff = BUFF.NEXT + ":" + eventJson.choice1Subsequent;
                } else {
                    nextEventBuff = BUFF.NEXT + ":" + eventJson.choice1Fail;
                }
                player.buffSet.add(nextEventBuff);
            })
        );
    } else {
        return new Choice(eventJson.id, eventJson.choice2,
            new EffectV2(eventJson.id, EffectType.STATS_COND, function () {
                const conditions = parseListAttr(eventJson.choice1Condition);
                let nextEventBuff;
                if (comparePlayerStats(conditions)) {
                    nextEventBuff = BUFF.NEXT + ":" + eventJson.choice2Subsequent;
                } else {
                    nextEventBuff = BUFF.NEXT + ":" + eventJson.choice2Fail;
                }
                player.buffSet.add(nextEventBuff);
            })
        );
    }
}

function comparePlayerStats(compareConditions) {
    const playerAttrs = compareConditions[0];
    const comparator = compareConditions[1].trim();
    const value = compareConditions[2];
    if (playerAttrs === "all") {
        return ATTRS.every(attr => {
            return compare(player[attr], comparator, value);
        });
    } else {
        return playerAttrs.every(attr => {
            return compare(player[attr], comparator, value);
        });
    }
}

function compare(value1, comparator, value2) {
    console.warn(value1);
    console.warn(comparator);
    console.warn(value2);
    if (comparator === "eq") {
        return value1 === value2;
    } else if (comparator === "gt") {
        return value1 > value2;
    } else if (comparator === "lt") {
        return value1 < value2;
    } else if (comparator === "ge") {
        return value1 >= value2;
    } else if (comparator === "le") {
        return value1 <= value2;
    } else {
        throw new Error("invalid comparator: " + comparator);
    }
}

function createNoopChoice(eventJson, isChoice1) {
    if (isChoice1) {
        return new Choice(eventJson.id, eventJson.choice1,
            new EffectV2(eventJson.id, EffectType.NOOP, function () {
                console.error(eventJson.choice1Subsequent);
                addNextEventBuff(eventJson.choice1Subsequent);
            })
        );
    } else {
        return new Choice(eventJson.id, eventJson.choice2,
            new EffectV2(eventJson.id, EffectType.NOOP, function () {
                console.error(eventJson.choice2Subsequent);
                addNextEventBuff(eventJson.choice2Subsequent);
            })
        );
    }
}

function createBuffChoice(eventJson, isChoice1) {
    if (isChoice1) {
        return new Choice(eventJson.id, eventJson.choice1,
            new EffectV2(eventJson.id, EffectType.ADD_BUFF, function () {
                const buffAttrs = parseListAttr(eventJson.choice1Buff);
                for (let i = 0; i < buffAttrs.length; i++) {
                    player.buffSet.add(buffAttrs[i]);
                }
                console.error(eventJson.choice1Subsequent);
                addNextEventBuff(eventJson.choice1Subsequent);
            })
        );
    } else {
        return new Choice(eventJson.id, eventJson.choice2,
            new EffectV2(eventJson.id, EffectType.ADD_BUFF, function () {
                const buffAttrs = parseListAttr(eventJson.choice2Buff);
                for (let i = 0; i < buffAttrs.length; i++) {
                    player.buffSet.add(buffAttrs[i]);
                }
                console.error(eventJson.choice1Subsequent);
                addNextEventBuff(eventJson.choice2Subsequent);
            })
        );
    }
}

function addNextEventBuff(nextEventId) {
    if (!isEmpty(nextEventId)) {
        const nextEventBuff = BUFF.NEXT + ":" + nextEventId;
        player.buffSet.add(nextEventBuff);
        console.error(player.buffSet);
    }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function parseListAttr(listAttr) {
    const listAttrStr = listAttr.replace(/^.+?{/, '{').replace(/\\/g, '').replace(/(")+/g, '\"');
    return JSON.parse(listAttrStr);
}

// Utility:比较player和enemy
// Choice1: 比较 attrToCompare1 例如 attrToCompare1 = ['gold', 'spirit'], 赢了获得winBuff， 输了lossBuff
// Choice2: 比较 attrToCompare2 例如 attrToCompare1 = ['power', 'spirit'], 赢了获得winBuff， 输了lossBuff

// 可以再复杂一点 两个选项的buff不一样。

function createFightEventWithBuff(id, name, img, line, posLine, negLine, stage, achievement, startBuff, type, subsequent, attrToCompare1, attrToCompare2, winBuff, lossBuff, enemy) {
    return new EventV2(id, name, img, line, stage, achievement, startBuff, type,
        new Choice(id, posLine,
            createStatsEffect(id, subsequent, attrToCompare1, winBuff, lossBuff)
        ),
        new Choice(id, negLine,
            createStatsEffect(id, subsequent, attrToCompare2, winBuff, lossBuff)
        ),
        enemy);
}

function createFightEffect(eventId, subsequent, attrToCompare, winBuff, lossBuff) {
    const callBack = function (enemy) {
        let playerSum = 0;
        let enemySum = 0;
        for (let attrName in attrToCompare) {
            playerSum += player[attrName];
            enemySum += enemy[attrName];
        }
        if (playerSum > enemySum) {
            player.buffSet.add(buffToAdd);
        } else {
            player.buffSet.add(lossBuff);
        }
    };
    return new EffectV2(eventId, EffectType.STATS_COND, callBack);
}

//V2 small random utility
//TODO: start buff
function createMinorRandomEvent(id, name, img, line, posLine, negLine, stage, achievement, type, subsequent, startBuff) {
    return new EventV2(id, name, img, line, stage, achievement, startBuff, type,
        new Choice(id, posLine,
            createMinorRandomEffect(id, subsequent)
        ),
        new Choice(id, negLine,
            createMinorRandomEffect(id, subsequent)
        ),
        null);
}

//V2 big random utility
function createMajorRandomEvent(id, name, img, line, posLine, negLine, stage, achievement, type, subsequent, startBuff) {
    return new EventV2(id, name, img, line, stage, achievement, startBuff, type,
        new Choice(id, posLine,
            createMajorRandomEffect(id, subsequent)
        ),
        new Choice(id, negLine,
            createMajorRandomEffect(id, subsequent)
        ),
        null);
}


//所有属性minor 随机+ - 5
function createMinorRandomEffect(eventId, subsequent) {
    const callBack = function () {
        player.spirit += -5 + 10 * Math.random();
        player.gold += -5 + 10 * Math.random();
        player.power += -5 + 10 * Math.random();
        player.agility += -5 + 10 * Math.random();
        player.intelligence += -5 + 10 * Math.random();
        player.goodness += -5 + 10 * Math.random();
        addNextEventBuff(subsequent);
    };
    return new EffectV2(eventId, EffectType.RANDOM, callBack);
}

//所有属性major 随机+ - 10
function createMajorRandomEffect(eventId, subsequent) {
    const callBack = function () {
        player.spirit += -10 + 20 * Math.random();
        player.gold += -10 + 20 * Math.random();
        player.power += -10 + 20 * Math.random();
        player.agility += -10 + 20 * Math.random();
        player.intelligence += -10 + 20 * Math.random();
        player.goodness += -10 + 20 * Math.random();
        addNextEventBuff(subsequent);
    };
    return new EffectV2(eventId, EffectType.RANDOM, callBack);
}


function loadAllEvents(rawEvents) {
    const events = {};
    for (let i = 0; i < rawEvents.length; i++) {
        const event = rawEvents[i];
        if (event.startStage === null) {
            continue;
        }
        const level = event.startStage;
        if (!(level in events)) {
            events[level] = [];
        }
        console.log(`Pushed event ${event.id} to level ${level}`);
        console.log(event);
        events[level].push(event);
    }
    return events;
}

function initPlayer(name) {
    return new Player(name, playerId);
}

function getCompleteEvents() {
    const completeEvents = new Set();
    player.achievements.forEach(
        achievement => {
            if (achievement.startsWith(BUFF.COMPLETE)) {
                const eventId = achievement.substring(BUFF.COMPLETE.length + 1);
                completeEvents.add(eventId);
            }
        }
    );
    return completeEvents;
}

function getNextTransitionEvent() {
    if (currentEvent.id === "end-1") {
        return eventMap["end-2"];
    } else if (currentEvent.id === "end-2") {
        return eventMap["end-3"];
    } else if (currentEvent.id === "end-3") {
        return eventMap["end-4"];
    } else if (currentEvent.id === "end-4") {
        return null;
    } else {
        return eventMap["end-1"];
    }
}

function getNextEvent() {

    if (currentMaxPage === 2) {
        return eventMap["boss-5"];
    } else {

        const deadEvent = checkDead();
        if (deadEvent != null) {
            return deadEvent;
        }

        console.error("numEventCurLevel: " + eventsPlayedThisState.size);
        console.error("EVENT_PER_LEVEL: " + EVENT_PER_LEVEL);

        console.warn("player.buffSet:");
        console.warn(player.buffSet);

        console.warn("player.achievements:");
        console.warn(player.achievements);

        if (eventsPlayedThisState.size > EVENT_PER_LEVEL && Math.random() < 0.1) {
            // 0.1 几率刷到boss
            return getBossEvent(currentLevel);
        }

        let allPossibleEvents = [];
        for (let curLevel = 1; curLevel <= currentLevel; curLevel++) {
            if (curLevel in eventsByLevel) {
                console.log(`Adding ${eventsByLevel[curLevel].length} events of level ${curLevel} `);
                allPossibleEvents = allPossibleEvents.concat(eventsByLevel[curLevel]);
            }
        }

        allPossibleEvents = allPossibleEvents.filter(event =>
            isEmpty(event.startAchievement) || player.achievements.has(event.startAchievement));

        console.warn("has buff: " + player.buffSet.has("BUFF:4"));

        allPossibleEvents = allPossibleEvents.filter(event =>
            isEmpty(event.startBuff) || player.buffSet.has(event.startBuff));

        // filter current event.
        if (currentEvent != null) {
            allPossibleEvents = allPossibleEvents.filter(event => event.id !== currentEvent.id);
        }

        allPossibleEvents = allPossibleEvents.filter(event => event.eventType === EventType.NORMAL);
        allPossibleEvents = allPossibleEvents.filter(event => !eventsPlayedThisState.has(event.eventId));

        const completeEvents = getCompleteEvents();
        console.error("completeEvents:");
        console.error(completeEvents);

        allPossibleEvents = allPossibleEvents.filter(event => !completeEvents.has(event.id));

        console.error("allPossibleEvents:");
        allPossibleEvents.forEach(event => console.warn(event));

        return allPossibleEvents[Math.floor(Math.random() * allPossibleEvents.length)];
    }
}

function getBossEvent(level) {
    console.warn("Get boss event: " + `stage-${level}-end`);
    return eventMap[`stage-${level}-end`];
}

function initModels() {
    return $.getJSON("ConsecutiveEvents.json").then(
        function (json) {

            player = initPlayer('Knight III');
            reincarnation = 1;
            numEvent = 0;
            currentLevel = START_LEVEL;

            let allEvents = convertConsecutiveEventJsonToEvents(json);
            console.log("Consecutive events length: " + allEvents.length);
            allEvents = allEvents.concat(createEvents());
            for (let i = 0; i < allEvents.length; i++) {
                console.error("i = " + i);
                console.error(allEvents[i]);
                eventMap[allEvents[i].id] = allEvents[i];
            }

            console.log("All events length: " + allEvents.length);

            eventsByLevel = loadAllEvents(allEvents);

            currentMaxPage = 0;
            currentPage = 0;
            return true;
        });
}

function updatePlayerStatus() {

    // pos
    // if (lastEvent !== null) {
    //     if (choiceId === 0) {
    //         player.spirit += lastEvent.posEffects[0].val;
    //         player.gold += lastEvent.posEffects[1].val;
    //         player.power += lastEvent.posEffects[2].val;
    //         player.agility += lastEvent.posEffects[3].val;
    //         player.intelligence += lastEvent.posEffects[4].val;
    //         player.goodness += lastEvent.posEffects[5].val;
    //     } else {
    //         player.spirit += lastEvent.negEffects[0].val;
    //         player.gold += lastEvent.negEffects[1].val;
    //         player.power += lastEvent.negEffects[2].val;
    //         player.agility += lastEvent.negEffects[3].val;
    //         player.intelligence += lastEvent.negEffects[4].val;
    //         player.goodness += lastEvent.negEffects[5].val;
    //     }
    // }

    //update fatigue
    // $(".fatigue").text(player.fatigue);
    // $(".spirit").text(player.spirit);
    // $(".gold").text(player.gold);
    // $(".power").text(player.power);
    // $(".agility").text(player.agility);
    // $(".intelligence").text(player.intelligence);

    $(".fatigue").animate({
            color: getColorByValue(player.fatigue),
            val: player.fatigue
        },
        {
            duration: 1000,
            step: function () {
                const ele = $(".fatigue");
                ele.text(Math.floor(this.val));
                ele.css("color", this.color);
            },
            complete: function () {
                const ele = $(".fatigue");
                ele.text(this.val);
                ele.css("color", this.color);
            }
        });

    $(".spirit").animate({
            color: getColorByValue(player.spirit),
            val: player.spirit
        },
        {
            duration: 1000,
            step: function () {
                const ele = $(".spirit");
                ele.text(Math.floor(this.val));
                ele.css("color", this.color);
            },
            complete: function () {
                const ele = $(".spirit");
                ele.text(this.val);
                ele.css("color", this.color);
            }
        });

    $(".gold").animate({
            color: getColorByValue(player.gold),
            val: player.gold
        },
        {
            duration: 1000,
            step: function () {
                const ele = $(".gold");
                ele.text(Math.floor(this.val));
                ele.css("color", this.color);
            },
            complete: function () {
                const ele = $(".gold");
                ele.text(this.val);
                ele.css("color", this.color);
            }
        });

    $(".power").animate({
            color: getColorByValue(player.power),
            val: player.power
        },
        {
            duration: 1000,
            step: function () {
                const ele = $(".power");
                ele.text(Math.floor(this.val));
                ele.css("color", this.color);
            },
            complete: function () {
                const ele = $(".power");
                ele.text(this.val);
                ele.css("color", this.color);
            }
        });

    $(".agility").animate({
            color: getColorByValue(player.agility),
            val: player.agility
        },
        {
            duration: 1000,
            step: function () {
                const ele = $(".agility");
                ele.text(Math.floor(this.val));
                ele.css("color", this.color);
            },
            complete: function () {
                const ele = $(".agility");
                ele.text(this.val);
                ele.css("color", this.color);
            }
        });

    $(".intelligence").animate({
            color: getColorByValue(player.intelligence),
            val: player.intelligence
        },
        {
            duration: 1000,
            step: function () {
                const ele = $(".intelligence");
                ele.text(Math.floor(this.val));
                ele.css("color", this.color);
            },
            complete: function () {
                const ele = $(".intelligence");
                ele.text(this.val);
                ele.css("color", this.color);
            }
        });
}

function getColorByValue(value) {
    if (value < 50) {
        return "red";
    } else if (value < 100) {
        return "#2b6aff";
    } else {
        return "black";
    }
}

//Check death logic
function postProcessBuff() {
    let nextEventId = null;
    console.log("player.buffSet: ");
    console.log(player.buffSet);
    const values = player.buffSet.values();
    player.buffSet.forEach(buff => {
        console.log("Buff: " + buff);
        if (buff.startsWith(BUFF.NEXT)) {
            console.log("BUFF.NEXT: " + buff);
            nextEventId = buff.split(":")[1];
            player.buffSet.delete(buff);
        } else if (buff.startsWith(BUFF.DEATH)) {
            console.log("BUFF.DEATH: " + buff);
            endBuff = buff;
            isEnd = true;
            nextEventId = buff.substring(BUFF.DEATH.length + 1);
            player.buffSet.delete(buff);
        } else if (buff.startsWith(BUFF.TITLE)) {
            console.log("BUFF.DEATH: " + buff);
            //TODO: all title should be in the format: [DEATH: EXPLANATION]
            const titleStrs = buff.substring(BUFF.TITLE.length + 1).split("|");
            player.achievements.add(buff);
            showTitle(titleStrs[0], titleStrs[1]);
            player.buffSet.delete(buff);
        } else if (buff.startsWith(BUFF.COMPLETE)) {
            console.log("BUFF.COMPLETE: " + buff);
            player.achievements.add(buff);
            // showTitle(title);
            player.buffSet.delete(buff);
        } else if (buff.startsWith(BUFF.MESSAGE)) {
            const titleStrs = buff.substring(BUFF.MESSAGE.length + 1).split("|");
            showMessage(titleStrs[0], titleStrs[1]);
            player.buffSet.delete(buff);
        }
    });
    return nextEventId;
}

function updateScene() {
    //update player status

    console.error("updateScene: ");
    console.error(currentEvent);

    if (currentEvent !== null && currentEvent !== undefined) {
        if (currentEvent.eventType !== EventType.STAGE) {
            numEvent++;
            const lastChoice = choiceId === 0 ? currentEvent.choice1 : currentEvent.choice2;
            const lastEffect = lastChoice.effect;
            console.warn("lastEffect: ");
            console.warn(lastEffect);
            console.warn("callBack: ");
            console.warn(lastEffect.callBack);
            console.warn(typeof lastEffect.callBack);
            lastEffect.callBack();
            if (currentEvent.eventType === EventType.UPLOAD) {
                insertCharacter(player, (res) => {
                    console.warn("Res of insert player:");
                    console.warn(res);
                });
            }
        }
    } else {
        log.error("Current Event is null or undefined");
    }

    updatePlayerStatus();
    let nextEventId = postProcessBuff();

    //TODO: win logic
    const winEvent = checkWin();

    let nextEvent = nextEventId === null ? getNextEvent() : eventMap[nextEventId];

    console.warn("nextEvent: ");
    console.warn(nextEvent);

    //Resolve the buff of the event
    if (nextEvent.startBuff !== undefined && nextEvent.startBuff !== null) {
        player.buffSet.delete(nextEvent.startBuff);
    }

    if (nextEvent.eventType === EventType.STAGE) {
        currentLevel++;
        console.error("currentLevel++ :" + currentLevel);
        eventsPlayedThisState.clear();
        //轮回logic
        //TODO: 增加一页
        if (currentEvent.eventType === EventType.ENDING || currentEvent.eventType === EventType.UPLOAD) {
            currentLevel = START_LEVEL;
            numEvent = 0;
            reincarnation++;
            player = initPlayer('Knight III');
        }
    }

    addAndRemovePage(nextEvent);

    currentEvent = nextEvent;
    console.log("currentEvent: ");
    console.log(currentEvent);
    if (currentEvent.eventType !== EventType.STAGE) {
        eventsPlayedThisState.add(currentEvent.id);
    }

}

function checkDead() {

    isEnd = player.gold <= 0 || player.spirit <= 0;
    if (isEnd) {
        if (player.goodness > 80 && player.goodness < 100) {
            return eventMap["dead-3"];
        } else if (player.goodness > 99) {
            return eventMap["dead-4"];
        } else if (player.goodness < 20 && player.goodness > 0) {
            return eventMap["dead-5"];
        } else if (player.goodness < 1) {
            return eventMap["dead-3"];
        } else if (currentPage > 50) {
            return eventMap["dead-2"];
        } else {
            return eventMap["dead-1"];
        }
    }

    return null;
}

//TODO: win condition to be filled.
function checkWin() {

}

function createPage(event) {
    if (event.eventType === EventType.NORMAL) {
        console.log("Creating normal event");
        return createEventPageDiv(event);
    } else if (event.eventType === EventType.BOSS) {
        console.log("Creating BOSS event");
        return createEventPageDiv(event);
    } else if (event.eventType === EventType.SUBSEQUENT) {
        console.log("Creating SUBSEQUENT event");
        return createEventPageDiv(event);
    } else if (event.eventType === EventType.STAGE) {
        console.log("Creating stage event");
        return createStagePageDiv(event);
    } else if (event.eventType === EventType.DEATH) {
        console.log("Creating DEATH event");
        return createDeathPage(event);
    } else if (event.eventType === EventType.UPLOAD) {
        console.log("Creating UPLOAD event");
        return createUploadPage();
    } else if (event.eventType === EventType.RESULT) {
        console.log("Creating title event");
        return createResultPageDiv();
    } else if (event.eventType === EventType.ENDING) {
        console.log("Creating ending event");
        return createEndingTransitionPageDiv(event);
    }
}

function createUploadPage() {
    const div = document.createElement('div');
    currentMaxPage++;
    div.className = `page-num-${currentMaxPage}`;
    div.innerHTML =
        `<div class="pages-content">
            <div class="pages-background"></div>
            <div class="content-inner">
              <h1>你想把这段经历写进书里吗？</h1>s
              <h2 class="pos-line">写入</h2>
              <h2 class="neg-line">算了</h2>
            </div>
          </div>`;
    return div;
}

function createStagePageDiv(event) {
    const div = document.createElement('div');
    currentMaxPage++;
    div.className = `page-num-${currentMaxPage}`;
    div.innerHTML =
        `<div class="pages-content">
            <div class="pages-background"></div>
            <div class="content-inner">
              <div class="img-container">
                <img src="${event.img}"/>
              </div>
              <h1>Stage ${currentLevel}</h1>
              <p class="to-fade">${event.name}</p>
              <p class="to-fade">${event.line}</p>
            </div>
          </div>`;
    return div;
}

function createEndingTransitionPageDiv(event) {

    let imageDivStr;
    if (event.id === "end-1") {
        imageDivStr = `<img class="slide-top" src="${event.img}"/>`;
    } else if (event.id === "end-2") {
        imageDivStr = `<img class="scale-up-center" src="${event.img}"/>`;
    } else if (event.id === "end-3") {
        imageDivStr = `<img class="blink-1" src="${event.img}"/>`;
    } else {
        imageDivStr = `<img src="${event.img}"/>`;
    }
    const div = document.createElement('div');
    currentMaxPage++;
    div.className = `page-num-${currentMaxPage}`;
    div.innerHTML =
        `<div class="pages-content">
            <div class="pages-background"></div>
            <div class="content-inner">
              <div class="img-container">
                ${imageDivStr}
              </div>
              <p class="to-fade"><font color='#dc143c'>${event.name}</font></p>
              <p class="to-fade">${event.line}</p>
            </div>
          </div>`;
    return div;
}

function createEventPageDiv(event) {
    const div = document.createElement('div');
    currentMaxPage++;
    div.className = `page-num-${currentMaxPage}`;
    div.innerHTML =
        `<div class="pages-content">
            <div class="pages-background"></div>
            <div class="content-inner">
              <div class="img-container">
                <img class="pulsate-fwd" src="${event.img}"/>
              </div>
              <p class="to-fade"><font color='#dc143c'>${event.name}: </font>${event.line}</p>
              <p class="pos-line">${event.choice1.line}</p>
              <p class="neg-line">${event.choice2.line}</p>
            </div>
        </div>`;
    return div;
}

function addPages(events, turn) {
    for (let i = 0; i < events.length; i++) {
        addPage(events[i], turn);
    }
}

function createEventPageAndTurn(eventPage) {
    createEventPageDiv(eventPage);
    $('.pages').turn('addPage', div);
}

// function addDeadPage(event) {
//     const achievementsStrList = [];
//     player.getAllTitles().forEach(
//         ach => {
//             achievementsStrList.push(ach.substring(ach.lastIndexOf(':') + 1));
//         }
//     );
//     let achievement = achievementsStrList.join(' ');
//     if (achievement === '') achievement = '一无所获';
//     console.error("achievements");
//     console.error(achievementsStrList);
//     $('.pages').turn('disable', true);
//     $(`.page-num-${currentMaxPage}`).html(`<div class="pages-content">
//             <div class="pages-background"></div>
//             <div class="content-inner">
//               <div class="img-container">
//                 <img src="${event.img}"/>
//               </div>
//               <h2>${event.line}</h2>
//               <h3><font color="#dc143c">善恶度: ${player.goodness}</font></h3>
//               <h3><font color="#dc143c">获得成就: ${achievement}</font></h3>
//             </div>
//           </div>`).addClass('puff-in-center');
// }

function createDeathPage(event) {
    const div = document.createElement('div');
    currentMaxPage++;
    div.className = `page-num-${currentMaxPage}`;
    div.innerHTML =
        `<div class="pages-content puff-in-center">
            <div class="pages-background"></div>
            <div class="content-inner">
              <div class="img-container">
                <img class="pulsate-fwd" src="${event.img}"/>
              </div>
              <h2>${event.line}</h2>
              <p class="pos-line">结束了吗？</p>
              <p class="neg-line">结束了吗？</p>
            </div>
        </div>`;
    return div;
}

function createResultPageDiv() {
    const div = document.createElement('div');
    currentMaxPage++;
    div.className = `page-num-${currentMaxPage}`;

    const achievementsStrList = [];
    player.getAllTitles().forEach(
        ach => {
            achievementsStrList.push(ach.substring(ach.lastIndexOf(':') + 1).split('|')[0]);
        }
    );

    let achievementHTML = "";
    achievementsStrList.forEach(function (text, i) {
        achievementHTML += generateAchievementHTML(i, text)
    });

    console.error("achievementHTML:");
    console.error(achievementHTML);

    div.innerHTML =
        `<div class="pages-content">
        <div class="pages-background"></div>
        <div class="content-inner">
              <h1>${player.name} 的旅途</h1>
              <h3>轮回次数：<span id="reincarnation">${reincarnation}</span></h3>
              <h3>经历事件：<span id="num-events">${numEvent}</span></h3>
              <h3>获得称号：</h3>
              <div class="achievements">
              ${achievementHTML}
              </div>
              <h3>善恶值：<span id="goodness">${player.goodness}</span></h3>
        </div>
    </div>`;
    return div;
}

function generateAchievementHTML(idx, achievement) {
    return `<div class="rubber-stamp" id="achievement${idx}">
                  <div class="rubber-stamp-inner">
                    <div class="rubber-line-top"></div>
                      <div class="offset-text-top">
                        ${achievement}
                      </span>  
                      <div class="rubber-line-bottom"></div>
                      </div>
                  </div>
                </div>`;
}

function addAndRemovePage(event) {
    console.log("Creating event:", event);
    const div = createPage(event);
    console.log("Adding div", div);

    $('.pages').append(div);
    $('.pages').turn('addPage', div);
    addDummyPage(true);
    $('.pages').turn('removePage', 'l');
    if (event.eventType === EventType.RESULT) {
        animateElems();
    }
}

function addPage(event, turn) {
    const div = createPage(event);
    console.log("Adding div", div);
    $('.pages').append(div);
    if (turn) {
        $('.pages').turn('addPage', div);
    }
    if (event.eventType === EventType.DEATH) {
        animateElems();
    }
}

function addDummyPage(turn) {
    currentMaxPage++;
    const div = document.createElement('div');
    div.className = `page-num-${currentMaxPage}`;
    div.innerHTML =
        `<div class="pages-content">
            <div class="pages-background"></div>
            <div class="content-inner">
            ${dummyId++}
            </div>
          </div>`;
    $('.pages').append(div);
    if (turn) {
        $('.pages').turn('addPage', div);
    }
}

function showTitle(title, explanation) {
    iziToast.show({
        theme: 'light',
        title: '获得称号 <' + title + '>',
        message: explanation,
        position: 'topCenter',
        color: 'green'
    });
}

function showMessage(title, explanation) {
    iziToast.show({
        theme: 'light',
        title: title,
        message: explanation,
        position: 'topCenter',
        color: 'grey'
    });
}


function animateElems() {
    // define element variables

    const sequence = [
        {e: $('#reincarnation'), p: {opacity: 0.8}, o: {duration: 600, easing: "swing"}},
        {e: $('#num-events'), p: {opacity: 0.8}, o: {duration: 600, easing: "swing", delay: 200}}
    ];

    let i = 0;
    player.getAllTitles().forEach(
        (title) => {
            console.warn(title);
            const titleStrs = title.substring(BUFF.TITLE + 1).split(":")[1].split("|");
            sequence.push({
                e: $(`#achievement${i}`),
                p: {opacity: 0.8},
                o: {duration: 600, delay: 200, easing: "swing"}
            });
            tippy(`#achievement${i}`, {
                content: titleStrs[1],
                delay: 100,
                arrow: true,
                arrowType: 'round',
                size: 'large',
                duration: 500,
                animation: 'scale'
            });
            i++;
        });

    sequence.push({e: $('#goodness'), p: {opacity: 0.8}, o: {duration: 600, easing: "swing", delay: 200}})

    // run animation sequence
    $.Velocity.RunSequence(sequence);

}

(function ($) {

    'use strict';

    var has3d,

        hasRot,

        vendor = '',

        version = '4.1.0',

        PI = Math.PI,

        A90 = PI / 2,

        isTouch = 'ontouchstart' in window,

        mouseEvents = (isTouch) ?
            {
                down: 'touchstart',
                move: 'touchmove',
                up: 'touchend',
                over: 'touchstart',
                out: 'touchend'
            }
            :
            {
                down: 'mousedown',
                move: 'mousemove',
                up: 'mouseup',
                over: 'mouseover',
                out: 'mouseout'
            },

        // Contansts used for each corner
        //   | tl * tr |
        // l | *     * | r
        //   | bl * br |

        corners = {
            backward: [],
            forward: ['br', 'tr'],
            all: ['tr', 'br', 'r']
        },

        // Display values

        displays = ['single', 'double'],

        // Direction values

        directions = ['ltr', 'rtl'],

        // Default options

        turnOptions = {

            // Enables hardware acceleration

            acceleration: true,

            // Display

            display: 'single',

            // Duration of transition in milliseconds

            duration: 600,

            // First page

            page: 1,

            // Enables gradients

            gradients: true,

            // Corners used when turning the page

            turnCorners: 'bl,br',

            // Events

            when: null
        },

        flipOptions = {

            // Size of the active zone of each corner

            cornerSize: 200

        },

        // Number of pages in the DOM, minimum value: 6

        pagesInDOM = 6,

        turnMethods = {

            // Singleton constructor
            // $('#selector').turn([options]);

            init: function (options) {

                // Define constants

                has3d = 'WebKitCSSMatrix' in window || 'MozPerspective' in document.body.style;
                hasRot = rotationAvailable();
                vendor = getPrefix();

                var i, that = this, pageNum = 0, data = this.data(), ch = this.children();

                // Set initial configuration

                options = $.extend({
                    width: this.width(),
                    height: this.height(),
                    direction: this.attr('dir') || this.css('direction') || 'ltr'
                }, turnOptions, options);

                data.opts = options;
                data.pageObjs = {};
                data.pages = {};
                data.pageWrap = {};
                data.pageZoom = {};
                data.pagePlace = {};
                data.pageMv = [];
                data.zoom = 1;
                data.totalPages = options.pages || 0;
                data.eventHandlers = {
                    touchStart: $.proxy(turnMethods._touchStart, this),
                    touchMove: $.proxy(turnMethods._touchMove, this),
                    touchEnd: $.proxy(turnMethods._touchEnd, this),
                    start: $.proxy(turnMethods._eventStart, this)
                };
                data.firstRemoving = true;


                // Add event listeners

                if (options.when)
                    for (i in options.when)
                        if (has(i, options.when))
                            this.bind(i, options.when[i]);

                // Set the css

                this.css({position: 'relative', width: options.width, height: options.height});

                // Set the initial display

                this.turn('display', options.display);

                // Set the direction

                if (options.direction !== '')
                    this.turn('direction', options.direction);

                // Prevent blue screen problems of switching to hardware acceleration mode
                // By forcing hardware acceleration for ever

                if (has3d && !isTouch && options.acceleration)
                    this.transform(translate(0, 0, true));

                // Add pages from the DOM

                for (i = 0; i < ch.length; i++) {
                    if ($(ch[i]).attr('ignore') != '1') {
                        this.turn('addPage', ch[i], ++pageNum);
                    }
                }

                // Event listeners

                $(this).bind(mouseEvents.down, data.eventHandlers.touchStart).bind('end', turnMethods._eventEnd).bind('pressed', turnMethods._eventPressed).bind('released', turnMethods._eventReleased).bind('flip', turnMethods._flip);

                $(this).parent().bind('start', data.eventHandlers.start);

                $(document).bind(mouseEvents.move, data.eventHandlers.touchMove).bind(mouseEvents.up, data.eventHandlers.touchEnd);

                // Set the initial page

                this.turn('page', options.page);

                // This flipbook is ready

                data.done = true;

                return this;
            },

            // Adds a page from external data

            addPage: function (element, page) {

                var currentPage,
                    className,
                    incPages = false,
                    data = this.data(),
                    lastPage = data.totalPages + 1;

                if (data.destroying)
                    return false;

                // Read the page number from the className of `element` - format: p[0-9]+

                if ((currentPage = /\bp([0-9]+)\b/.exec($(element).attr('class'))))
                    page = parseInt(currentPage[1], 10);

                if (page) {

                    if (page == lastPage)
                        incPages = true;
                    else if (page > lastPage)
                        throw turnError('Page "' + page + '" cannot be inserted');

                } else {

                    page = lastPage;
                    incPages = true;

                }

                if (page >= 1 && page <= lastPage) {

                    if (data.display == 'double')
                        className = (page % 2) ? ' odd' : ' even';
                    else
                        className = '';

                    // Stop animations
                    if (data.done)
                        this.turn('stop');

                    // Move pages if it's necessary
                    if (page in data.pageObjs)
                        turnMethods._movePages.call(this, page, 1);

                    // Increase the number of pages
                    if (incPages)
                        data.totalPages = lastPage;

                    // Add element
                    data.pageObjs[page] = $(element).css({'float': 'left'}).addClass('page p' + page + className);

                    if (!hasHardPage() && data.pageObjs[page].hasClass('hard')) {
                        data.pageObjs[page].removeClass('hard');
                    }

                    // Add page
                    turnMethods._addPage.call(this, page);

                    // Remove pages out of range
                    turnMethods._removeFromDOM.call(this);
                }

                return this;
            },

            // Adds a page

            _addPage: function (page) {

                var data = this.data(),
                    element = data.pageObjs[page];

                if (element)
                    if (turnMethods._necessPage.call(this, page)) {

                        if (!data.pageWrap[page]) {

                            // Wrapper
                            data.pageWrap[page] = $('<div/>',
                                {
                                    'class': 'page-wrapper',
                                    page: page,
                                    css: {
                                        position: 'absolute',
                                        overflow: 'hidden'
                                    }
                                });

                            // Append to this flipbook
                            this.append(data.pageWrap[page]);

                            if (!data.pagePlace[page]) {

                                data.pagePlace[page] = page;
                                // Move `pageObjs[page]` to wrapper
                                data.pageObjs[page].appendTo(data.pageWrap[page]);

                            }

                            // Set the size of the page
                            var prop = turnMethods._pageSize.call(this, page, true);
                            element.css({width: prop.width, height: prop.height});
                            data.pageWrap[page].css(prop);

                        }

                        if (data.pagePlace[page] == page) {

                            // If the page isn't in another place, create the flip effect
                            turnMethods._makeFlip.call(this, page);

                        }

                    } else {

                        // Place
                        data.pagePlace[page] = 0;

                        // Remove element from the DOM
                        if (data.pageObjs[page])
                            data.pageObjs[page].remove();

                    }

            },

            // Checks if a page is in memory

            hasPage: function (page) {

                return has(page, this.data().pageObjs);

            },

            // Centers the flipbook
            center: function (page) {

                var data = this.data(),
                    size = $(this).turn('size'),
                    left = 0;

                if (!data.noCenter) {
                    if (data.display == 'double') {
                        var view = this.turn('view', page || data.tpage || data.page);

                        if (data.direction == 'ltr') {
                            if (!view[0])
                                left -= size.width / 4;
                            else if (!view[1])
                                left += size.width / 4;
                        } else {
                            if (!view[0])
                                left += size.width / 4;
                            else if (!view[1])
                                left -= size.width / 4;
                        }

                    }

                    $(this).css({marginLeft: left});
                }

                return this;

            }
            ,

            // Destroys the flipbook

            destroy: function () {

                var page,
                    flipbook = this,
                    data = this.data(),
                    events = [
                        'end', 'first', 'flip', 'last', 'pressed',
                        'released', 'start', 'turning', 'turned',
                        'zooming', 'missing'];

                if (trigger('destroying', this) == 'prevented')
                    return;

                data.destroying = true;

                $.each(events, function (index, eventName) {
                    flipbook.unbind(eventName);
                });

                this.parent().unbind('start', data.eventHandlers.start);

                $(document).unbind(mouseEvents.move, data.eventHandlers.touchMove).unbind(mouseEvents.up, data.eventHandlers.touchEnd);

                while (data.totalPages !== 0) {
                    this.turn('removePage', data.totalPages);
                }

                if (data.fparent)
                    data.fparent.remove();

                if (data.shadow)
                    data.shadow.remove();

                this.removeData();
                data = null;

                return this;

            },

            // Checks if this element is a flipbook

            is: function () {

                return typeof(this.data().pages) == 'object';

            },

            // Sets and gets the zoom value

            zoom: function (newZoom) {

                var data = this.data();

                if (typeof(newZoom) == 'number') {

                    if (newZoom < 0.001 || newZoom > 100)
                        throw turnError(newZoom + ' is not a value for zoom');

                    if (trigger('zooming', this, [newZoom, data.zoom]) == 'prevented')
                        return this;

                    var size = this.turn('size'),
                        currentView = this.turn('view'),
                        iz = 1 / data.zoom,
                        newWidth = Math.round(size.width * iz * newZoom),
                        newHeight = Math.round(size.height * iz * newZoom);

                    data.zoom = newZoom;

                    $(this).turn('stop').turn('size', newWidth, newHeight);
                    /*.
        css({marginTop: size.height * iz / 2 - newHeight / 2});*/

                    if (data.opts.autoCenter)
                        this.turn('center');
                    /*else
        $(this).css({marginLeft: size.width * iz / 2 - newWidth / 2});*/

                    turnMethods._updateShadow.call(this);

                    for (var i = 0; i < currentView.length; i++) {
                        if (currentView[i] && data.pageZoom[currentView[i]] != data.zoom) {

                            this.trigger('zoomed', [
                                currentView[i],
                                currentView,
                                data.pageZoom[currentView[i]],
                                data.zoom]);

                            data.pageZoom[currentView[i]] = data.zoom;
                        }
                    }

                    return this;

                } else
                    return data.zoom;

            },

            // Gets the size of a page

            _pageSize: function (page, position) {

                var data = this.data(),
                    prop = {};

                if (data.display == 'single') {

                    prop.width = this.width();
                    prop.height = this.height();

                    if (position) {
                        prop.top = 0;
                        prop.left = 0;
                        prop.right = 'auto';
                    }

                } else {

                    var pageWidth = this.width() / 2,
                        pageHeight = this.height();

                    if (data.pageObjs[page].hasClass('own-size')) {
                        prop.width = data.pageObjs[page].width();
                        prop.height = data.pageObjs[page].height();
                    } else {
                        prop.width = pageWidth;
                        prop.height = pageHeight;
                    }

                    if (position) {
                        var odd = page % 2;
                        prop.top = (pageHeight - prop.height) / 2;

                        if (data.direction == 'ltr') {

                            prop[(odd) ? 'right' : 'left'] = pageWidth - prop.width;
                            prop[(odd) ? 'left' : 'right'] = 'auto';

                        } else {

                            prop[(odd) ? 'left' : 'right'] = pageWidth - prop.width;
                            prop[(odd) ? 'right' : 'left'] = 'auto';

                        }

                    }
                }

                return prop;

            },

            // Prepares the flip effect for a page

            _makeFlip: function (page) {

                var data = this.data();

                if (!data.pages[page] && data.pagePlace[page] == page) {

                    var single = data.display == 'single',
                        odd = page % 2;

                    data.pages[page] = data.pageObjs[page].css(turnMethods._pageSize.call(this, page)).flip({
                        page: page,
                        next: (odd || single) ? page + 1 : page - 1,
                        turn: this
                    }).flip('disable', data.disabled);

                    // Issue about z-index
                    turnMethods._setPageLoc.call(this, page);

                    data.pageZoom[page] = data.zoom;

                }

                return data.pages[page];
            },

            // Makes pages within a range

            _makeRange: function () {

                var page, range,
                    data = this.data();

                if (data.totalPages < 1)
                    return;

                range = this.turn('range');

                for (page = range[0]; page <= range[1]; page++)
                    turnMethods._addPage.call(this, page);

            },

            // Returns a range of pages that should be in the DOM
            // Example:
            // - page in the current view, return true
            // * page is in the range, return true
            // Otherwise, return false
            //
            // 1 2-3 4-5 6-7 8-9 10-11 12-13
            //   **  **  --   **  **

            range: function (page) {

                var remainingPages, left, right, view,
                    data = this.data();

                page = page || data.tpage || data.page || 1;
                view = turnMethods._view.call(this, page);

                if (page < 1 || page > data.totalPages)
                    throw turnError('"' + page + '" is not a valid page');


                view[1] = view[1] || view[0];

                if (view[0] >= 1 && view[1] <= data.totalPages) {

                    remainingPages = Math.floor((pagesInDOM - 2) / 2);

                    if (data.totalPages - view[1] > view[0]) {
                        left = Math.min(view[0] - 1, remainingPages);
                        right = 2 * remainingPages - left;
                    } else {
                        right = Math.min(data.totalPages - view[1], remainingPages);
                        left = 2 * remainingPages - right;
                    }

                } else {
                    left = pagesInDOM - 1;
                    right = pagesInDOM - 1;
                }

                return [Math.max(1, view[0] - left),
                    Math.min(data.totalPages, view[1] + right)];

            },

            // Detects if a page is within the range of `pagesInDOM` from the current view

            _necessPage: function (page) {

                if (page === 0)
                    return true;

                var range = this.turn('range');

                return this.data().pageObjs[page].hasClass('fixed') ||
                    (page >= range[0] && page <= range[1]);

            },

            // Releases memory by removing pages from the DOM

            _removeFromDOM: function () {

                var page, data = this.data();

                for (page in data.pageWrap)
                    if (has(page, data.pageWrap) &&
                        !turnMethods._necessPage.call(this, page))
                        turnMethods._removePageFromDOM.call(this, page);

            },

            // Removes a page from DOM and its internal references

            _removePageFromDOM: function (page) {

                var data = this.data();

                if (data.pages[page]) {
                    var dd = data.pages[page].data();

                    flipMethods._moveFoldingPage.call(data.pages[page], false);

                    if (dd.f && dd.f.fwrapper)
                        dd.f.fwrapper.remove();

                    data.pages[page].removeData();
                    data.pages[page].remove();
                    delete data.pages[page];
                }

                if (data.pageObjs[page])
                    data.pageObjs[page].remove();

                if (data.pageWrap[page]) {
                    data.pageWrap[page].remove();
                    delete data.pageWrap[page];
                }

                turnMethods._removeMv.call(this, page);

                delete data.pagePlace[page];
                delete data.pageZoom[page];

            },

            // Removes a page

            removePage: function (page) {

                var data = this.data();

                // Delete all the pages
                if (page === '*') {

                    while (data.totalPages !== 0) {
                        this.turn('removePage', data.totalPages);
                    }

                } else if (page === 'l') {

                    console.log("Total:", data.totalPages);
                    console.log("Current:", data.page);
                    let pg;
                    if (data.totalPages - data.page === 3) {
                        pg = data.page + 2;
                    } else {
                        pg = data.page + 1;
                    }
                    console.log("pg:", pg);


                    while (data.totalPages !== pg) {
                        this.turn('removePage', data.totalPages - 2);
                    }

                } else {

                    if (page < 1 || page > data.totalPages)
                        throw turnError('The page ' + page + ' doesn\'t exist');

                    if (data.pageObjs[page]) {

                        // Stop animations
                        this.turn('stop');

                        console.log("removing:", page);

                        // Remove `page`
                        turnMethods._removePageFromDOM.call(this, page);

                        delete data.pageObjs[page];

                    }

                    // Move the pages
                    turnMethods._movePages.call(this, page, -1);

                    // Resize the size of this flipbook
                    data.totalPages = data.totalPages - 1;

                    // Check the current view

                    if (data.page > data.totalPages) {

                        data.page = null;
                        turnMethods._fitPage.call(this, data.totalPages);

                    } else {

                        turnMethods._makeRange.call(this);
                        this.turn('update');

                    }
                }

                return this;

            },

            // Moves pages

            _movePages: function (from, change) {

                var page,
                    that = this,
                    data = this.data(),
                    single = data.display == 'single',
                    move = function (page) {

                        var next = page + change,
                            odd = next % 2,
                            className = (odd) ? ' odd ' : ' even ';

                        if (data.pageObjs[page])
                            data.pageObjs[next] = data.pageObjs[page].removeClass('p' + page + ' odd even').addClass('p' + next + className);

                        if (data.pagePlace[page] && data.pageWrap[page]) {

                            data.pagePlace[next] = next;

                            if (data.pageObjs[next].hasClass('fixed'))
                                data.pageWrap[next] = data.pageWrap[page].attr('page', next);
                            else
                                data.pageWrap[next] = data.pageWrap[page].css(turnMethods._pageSize.call(that, next, true)).attr('page', next);

                            if (data.pages[page])
                                data.pages[next] = data.pages[page].flip('options', {
                                    page: next,
                                    next: (single || odd) ? next + 1 : next - 1
                                });

                            if (change) {
                                delete data.pages[page];
                                delete data.pagePlace[page];
                                delete data.pageZoom[page];
                                delete data.pageObjs[page];
                                delete data.pageWrap[page];
                            }

                        }

                    };

                if (change > 0)
                    for (page = data.totalPages; page >= from; page--)
                        move(page);
                else
                    for (page = from; page <= data.totalPages; page++)
                        move(page);

            },

            // Sets or Gets the display mode

            display: function (display) {

                var data = this.data(),
                    currentDisplay = data.display;

                if (display === undefined) {

                    return currentDisplay;

                } else {

                    if ($.inArray(display, displays) == -1)
                        throw turnError('"' + display + '" is not a value for display');

                    switch (display) {
                        case 'single':

                            // Create a temporal page to use as folded page

                            if (!data.pageObjs[0]) {
                                this.turn('stop').css({'overflow': 'hidden'});

                                data.pageObjs[0] = $('<div />',
                                    {'class': 'page p-temporal'}).css({
                                    width: this.width(),
                                    height: this.height()
                                }).appendTo(this);
                            }

                            this.addClass('shadow');

                            break;
                        case 'double':

                            // Remove the temporal page

                            if (data.pageObjs[0]) {
                                this.turn('stop').css({'overflow': ''});
                                data.pageObjs[0].remove();
                                delete data.pageObjs[0];
                            }

                            this.removeClass('shadow');

                            break;
                    }


                    data.display = display;

                    if (currentDisplay) {
                        var size = this.turn('size');
                        turnMethods._movePages.call(this, 1, 0);
                        this.turn('size', size.width, size.height).turn('update');
                    }

                    return this;

                }

            },

            // Gets and sets the direction of the flipbook

            direction: function (dir) {

                var data = this.data();

                if (dir === undefined) {

                    return data.direction;

                } else {

                    dir = dir.toLowerCase();

                    if ($.inArray(dir, directions) == -1)
                        throw turnError('"' + dir + '" is not a value for direction');

                    if (dir == 'rtl') {
                        $(this).attr('dir', 'ltr').css({direction: 'ltr'});
                    }

                    data.direction = dir;

                    if (data.done)
                        this.turn('size', $(this).width(), $(this).height());

                    return this;
                }

            },

            // Detects animation

            animating: function () {

                return this.data().pageMv.length > 0;

            },

            // Gets the current activated corner

            corner: function () {

                var corner,
                    page,
                    data = this.data();

                for (page in data.pages) {
                    if (has(page, data.pages))
                        if ((corner = data.pages[page].flip('corner'))) {
                            return corner;
                        }
                }

                return false;
            },

            // Gets the data stored in the flipbook

            data: function () {

                return this.data();

            },

            // Disables and enables the effect

            disable: function (disable) {

                var page,
                    data = this.data(),
                    view = this.turn('view');

                data.disabled = disable === undefined || disable === true;

                for (page in data.pages) {
                    if (has(page, data.pages))
                        data.pages[page].flip('disable',
                            (data.disabled) ? true : $.inArray(parseInt(page, 10), view) == -1);
                }

                return this;

            },

            // Disables and enables the effect

            disabled: function (disable) {

                if (disable === undefined) {
                    return this.data().disabled === true;
                } else {
                    return this.turn('disable', disable);
                }

            },

            // Gets and sets the size

            size: function (width, height) {

                if (width === undefined || height === undefined) {

                    return {width: this.width(), height: this.height()};

                } else {

                    this.turn('stop');

                    var page, prop,
                        data = this.data(),
                        pageWidth = (data.display == 'double') ? width / 2 : width;

                    this.css({width: width, height: height});

                    if (data.pageObjs[0])
                        data.pageObjs[0].css({width: pageWidth, height: height});

                    for (page in data.pageWrap) {
                        if (!has(page, data.pageWrap)) continue;

                        prop = turnMethods._pageSize.call(this, page, true);

                        data.pageObjs[page].css({width: prop.width, height: prop.height});
                        data.pageWrap[page].css(prop);

                        if (data.pages[page])
                            data.pages[page].css({width: prop.width, height: prop.height});
                    }

                    this.turn('resize');

                    return this;

                }
            },

            // Resizes each page

            resize: function () {

                var page, data = this.data();

                if (data.pages[0]) {
                    data.pageWrap[0].css({left: -this.width()});
                    data.pages[0].flip('resize', true);
                }

                for (page = 1; page <= data.totalPages; page++)
                    if (data.pages[page])
                        data.pages[page].flip('resize', true);

                turnMethods._updateShadow.call(this);

                if (data.opts.autoCenter)
                    this.turn('center');

            },

            // Removes an animation from the cache

            _removeMv: function (page) {

                var i, data = this.data();

                for (i = 0; i < data.pageMv.length; i++)
                    if (data.pageMv[i] == page) {
                        data.pageMv.splice(i, 1);
                        return true;
                    }

                return false;

            },

            // Adds an animation to the cache

            _addMv: function (page) {

                var data = this.data();

                turnMethods._removeMv.call(this, page);
                data.pageMv.push(page);

            },

            // Gets indexes for a view

            _view: function (page) {

                var data = this.data();

                page = page || data.page;

                if (data.display == 'double')
                    return (page % 2) ? [page - 1, page] : [page, page + 1];
                else
                    return [page];

            },

            // Gets a view

            view: function (page) {

                var data = this.data(),
                    view = turnMethods._view.call(this, page);

                if (data.display == 'double')
                    return [(view[0] > 0) ? view[0] : 0,
                        (view[1] <= data.totalPages) ? view[1] : 0];
                else
                    return [(view[0] > 0 && view[0] <= data.totalPages) ? view[0] : 0];

            },

            // Stops animations

            stop: function (ignore, animate) {

                if (this.turn('animating')) {

                    var i, opts, page,
                        data = this.data();

                    if (data.tpage) {
                        data.page = data.tpage;
                        delete data['tpage'];
                    }

                    for (i = 0; i < data.pageMv.length; i++) {

                        if (!data.pageMv[i] || data.pageMv[i] === ignore)
                            continue;

                        page = data.pages[data.pageMv[i]];
                        opts = page.data().f.opts;

                        page.flip('hideFoldedPage', animate);

                        if (!animate)
                            flipMethods._moveFoldingPage.call(page, false);

                        if (opts.force) {
                            opts.next = (opts.page % 2 === 0) ? opts.page - 1 : opts.page + 1;
                            delete opts['force'];
                        }

                    }
                }

                this.turn('update');

                return this;
            },

            // Gets and sets the number of pages

            pages: function (pages) {

                var data = this.data();

                if (pages) {

                    if (pages < data.totalPages) {

                        for (var page = data.totalPages; page > pages; page--)
                            this.turn('removePage', page);

                    }

                    data.totalPages = pages;
                    turnMethods._fitPage.call(this, data.page);

                    return this;

                } else
                    return data.totalPages;

            },

            // Checks missing pages

            _missing: function (page) {

                var data = this.data();

                if (data.totalPages < 1)
                    return;

                var p,
                    range = this.turn('range', page),
                    missing = [];

                for (p = range[0]; p <= range[1]; p++) {
                    if (!data.pageObjs[p])
                        missing.push(p);
                }

                if (missing.length > 0)
                    this.trigger('missing', [missing]);

            },

            // Sets a page without effect

            _fitPage: function (page) {

                var data = this.data(),
                    newView = this.turn('view', page);

                turnMethods._missing.call(this, page);

                if (!data.pageObjs[page])
                    return;

                data.page = page;

                this.turn('stop');

                for (var i = 0; i < newView.length; i++) {

                    if (newView[i] && data.pageZoom[newView[i]] != data.zoom) {

                        this.trigger('zoomed', [
                            newView[i],
                            newView,
                            data.pageZoom[newView[i]],
                            data.zoom]);

                        data.pageZoom[newView[i]] = data.zoom;

                    }
                }

                turnMethods._removeFromDOM.call(this);
                turnMethods._makeRange.call(this);
                turnMethods._updateShadow.call(this);
                this.trigger('turned', [page, newView]);
                this.turn('update');

                if (data.opts.autoCenter)
                    this.turn('center');

            },

            // Turns the page

            _turnPage: function (page) {

                var current,
                    next,
                    data = this.data(),
                    place = data.pagePlace[page],
                    view = this.turn('view'),
                    newView = this.turn('view', page);


                if (data.page != page) {

                    var currentPage = data.page;

                    if (trigger('turning', this, [page, newView]) == 'prevented') {

                        if (currentPage == data.page && $.inArray(place, data.pageMv) != -1)
                            data.pages[place].flip('hideFoldedPage', true);

                        return;

                    }

                    if ($.inArray(1, newView) != -1)
                        this.trigger('first');
                    if ($.inArray(data.totalPages, newView) != -1)
                        this.trigger('last');

                }

                if (data.display == 'single') {
                    current = view[0];
                    next = newView[0];
                } else if (view[1] && page > view[1]) {
                    current = view[1];
                    next = newView[0];
                } else if (view[0] && page < view[0]) {
                    current = view[0];
                    next = newView[1];
                }

                var optsCorners = data.opts.turnCorners.split(','),
                    flipData = data.pages[current].data().f,
                    opts = flipData.opts,
                    actualPoint = flipData.point;

                turnMethods._missing.call(this, page);

                if (!data.pageObjs[page])
                    return;

                this.turn('stop');

                data.page = page;

                turnMethods._makeRange.call(this);

                data.tpage = next;

                if (opts.next != next) {
                    opts.next = next;
                    opts.force = true;
                }

                this.turn('update');

                flipData.point = actualPoint;

                if (flipData.effect == 'hard')
                    if (data.direction == 'ltr')
                        data.pages[current].flip('turnPage',
                            (page > current) ? 'r' : 'l');
                    else
                        data.pages[current].flip('turnPage',
                            (page > current) ? 'l' : 'r');
                else {
                    if (data.direction == 'ltr')
                        data.pages[current].flip('turnPage',
                            optsCorners[(page > current) ? 1 : 0]);
                    else
                        data.pages[current].flip('turnPage',
                            optsCorners[(page > current) ? 0 : 1]);
                }

            },

            // Gets and sets a page

            page: function (page) {

                var data = this.data();

                if (page === undefined) {

                    return data.page;

                } else {

                    if (!data.disabled && !data.destroying) {

                        page = parseInt(page, 10);

                        if (page > 0 && page <= data.totalPages) {

                            if (page != data.page) {
                                if (!data.done || $.inArray(page, this.turn('view')) != -1)
                                    turnMethods._fitPage.call(this, page);
                                else
                                    turnMethods._turnPage.call(this, page);
                            }

                            return this;

                        } else {

                            throw turnError('The page ' + page + ' does not exist');

                        }

                    }

                }

            },

            // Turns to the next view

            next: function () {

                return this.turn('page', Math.min(this.data().totalPages,
                    turnMethods._view.call(this, this.data().page).pop() + 1));

            },

            // Turns to the previous view

            previous: function () {

                return this.turn('page', Math.max(1,
                    turnMethods._view.call(this, this.data().page).shift() - 1));

            },

            // Shows a peeling corner

            peel: function (corner, animate) {

                var data = this.data(),
                    view = this.turn('view');

                animate = (animate === undefined) ? true : animate === true;

                if (corner === false) {

                    this.turn('stop', null, animate);

                } else {

                    if (data.display == 'single') {

                        data.pages[data.page].flip('peel', corner, animate);

                    } else {

                        var page;

                        if (data.direction == 'ltr') {

                            page = (corner.indexOf('l') != -1) ? view[0] : view[1];

                        } else {

                            page = (corner.indexOf('l') != -1) ? view[1] : view[0];

                        }

                        if (data.pages[page])
                            data.pages[page].flip('peel', corner, animate);

                    }
                }

                return this;

            },

            // Adds a motion to the internal list
            // This event is called in context of flip

            _addMotionPage: function () {

                var opts = $(this).data().f.opts,
                    turn = opts.turn,
                    dd = turn.data();

                turnMethods._addMv.call(turn, opts.page);

            },

            // This event is called in context of flip

            _eventStart: function (e, opts, corner) {

                var data = opts.turn.data(),
                    actualZoom = data.pageZoom[opts.page];

                if (e.isDefaultPrevented()) {
                    turnMethods._updateShadow.call(opts.turn);
                    return;
                }

                if (actualZoom && actualZoom != data.zoom) {

                    opts.turn.trigger('zoomed', [
                        opts.page,
                        opts.turn.turn('view', opts.page),
                        actualZoom,
                        data.zoom]);

                    data.pageZoom[opts.page] = data.zoom;

                }

                if (data.display == 'single' && corner) {

                    if ((corner.charAt(1) == 'l' && data.direction == 'ltr') ||
                        (corner.charAt(1) == 'r' && data.direction == 'rtl')) {

                        opts.next = (opts.next < opts.page) ? opts.next : opts.page - 1;
                        opts.force = true;

                    } else {

                        opts.next = (opts.next > opts.page) ? opts.next : opts.page + 1;

                    }

                }

                turnMethods._addMotionPage.call(e.target);
                turnMethods._updateShadow.call(opts.turn);
            },

            // This event is called in context of flip

            _eventEnd: function (e, opts, turned) {

                var that = $(e.target),
                    data = that.data().f,
                    turn = opts.turn,
                    dd = turn.data();

                if (turned) {

                    var tpage = dd.tpage || dd.page;

                    if (tpage == opts.next || tpage == opts.page) {
                        delete dd.tpage;

                        turnMethods._fitPage.call(turn, tpage || opts.next, true);
                    }

                } else {

                    turnMethods._removeMv.call(turn, opts.page);
                    turnMethods._updateShadow.call(turn);
                    turn.turn('update');

                }

            },

            // This event is called in context of flip

            _eventPressed: function (e) {

                var page,
                    data = $(e.target).data().f,
                    turn = data.opts.turn,
                    turnData = turn.data(),
                    pages = turnData.pages;

                turnData.mouseAction = true;

                turn.turn('update');

                return data.time = new Date().getTime();

            },

            // This event is called in context of flip

            _eventReleased: function (e, point) {

                var outArea,
                    page = $(e.target),
                    data = page.data().f,
                    turn = data.opts.turn,
                    turnData = turn.data();

                if (turnData.display == 'single') {
                    outArea = (point.corner == 'br' || point.corner == 'tr') ?
                        point.x < page.width() / 2 :
                        point.x > page.width() / 2;
                } else {
                    outArea = point.x < 0 || point.x > page.width();
                }

                if ((new Date()).getTime() - data.time < 200 || outArea) {

                    e.preventDefault();
                    turnMethods._turnPage.call(turn, data.opts.next);

                }

                turnData.mouseAction = false;

            },

            // This event is called in context of flip

            _flip: function (e) {

                e.stopPropagation();

                var opts = $(e.target).data().f.opts;

                opts.turn.trigger('turn', [opts.next]);

                if (opts.turn.data().opts.autoCenter) {
                    opts.turn.turn('center', opts.next);
                }

            },

            //
            _touchStart: function () {
                var data = this.data();
                for (var page in data.pages) {
                    if (has(page, data.pages) &&
                        flipMethods._eventStart.apply(data.pages[page], arguments) === false) {
                        return false;
                    }
                }
            },

            //
            _touchMove: function () {
                var data = this.data();
                for (var page in data.pages) {
                    if (has(page, data.pages)) {
                        flipMethods._eventMove.apply(data.pages[page], arguments);
                    }
                }
            },

            //
            _touchEnd: function () {
                var data = this.data();
                for (var page in data.pages) {
                    if (has(page, data.pages)) {
                        flipMethods._eventEnd.apply(data.pages[page], arguments);
                    }
                }
            },

            // Calculate the z-index value for pages during the animation

            calculateZ: function (mv) {

                var i, page, nextPage, placePage, dpage,
                    that = this,
                    data = this.data(),
                    view = this.turn('view'),
                    currentPage = view[0] || view[1],
                    total = mv.length - 1,
                    r = {pageZ: {}, partZ: {}, pageV: {}},

                    addView = function (page) {
                        var view = that.turn('view', page);
                        if (view[0]) r.pageV[view[0]] = true;
                        if (view[1]) r.pageV[view[1]] = true;
                    };

                for (i = 0; i <= total; i++) {
                    page = mv[i];
                    nextPage = data.pages[page].data().f.opts.next;
                    placePage = data.pagePlace[page];
                    addView(page);
                    addView(nextPage);
                    dpage = (data.pagePlace[nextPage] == nextPage) ? nextPage : page;
                    r.pageZ[dpage] = data.totalPages - Math.abs(currentPage - dpage);
                    r.partZ[placePage] = data.totalPages * 2 - total + i;
                }

                return r;
            },

            // Updates the z-index and display property of every page

            update: function () {

                var page,
                    data = this.data();

                if (this.turn('animating') && data.pageMv[0] !== 0) {

                    // Update motion

                    var p, apage, fixed,
                        pos = this.turn('calculateZ', data.pageMv),
                        corner = this.turn('corner'),
                        actualView = this.turn('view'),
                        newView = this.turn('view', data.tpage);

                    for (page in data.pageWrap) {

                        if (!has(page, data.pageWrap))
                            continue;

                        fixed = data.pageObjs[page].hasClass('fixed');

                        data.pageWrap[page].css({
                            display: (pos.pageV[page] || fixed) ? '' : 'none',
                            zIndex:
                                (data.pageObjs[page].hasClass('hard') ?
                                        pos.partZ[page]
                                        :
                                        pos.pageZ[page]
                                ) || (fixed ? -1 : 0)
                        });

                        if ((p = data.pages[page])) {

                            p.flip('z', pos.partZ[page] || null);

                            if (pos.pageV[page])
                                p.flip('resize');

                            if (data.tpage) { // Is it turning the page to `tpage`?

                                p.flip('hover', false).flip('disable',
                                    $.inArray(parseInt(page, 10), data.pageMv) == -1 &&
                                    page != newView[0] &&
                                    page != newView[1]);

                            } else {

                                p.flip('hover', corner === false).flip('disable', page != actualView[0] && page != actualView[1]);

                            }

                        }

                    }

                } else {

                    // Update static pages

                    for (page in data.pageWrap) {

                        if (!has(page, data.pageWrap))
                            continue;

                        var pageLocation = turnMethods._setPageLoc.call(this, page);

                        if (data.pages[page]) {
                            data.pages[page].flip('disable', data.disabled || pageLocation != 1).flip('hover', true).flip('z', null);
                        }
                    }
                }

                return this;
            },

            // Updates the position and size of the flipbook's shadow

            _updateShadow: function () {

                var view, view2, shadow,
                    data = this.data(),
                    width = this.width(),
                    height = this.height(),
                    pageWidth = (data.display == 'single') ? width : width / 2;

                view = this.turn('view');

                if (!data.shadow) {
                    data.shadow = $('<div />', {
                        'class': 'shadow',
                        'css': divAtt(0, 0, 0).css
                    }).appendTo(this);
                }

                for (var i = 0; i < data.pageMv.length; i++) {
                    if (!view[0] || !view[1])
                        break;

                    view = this.turn('view', data.pages[data.pageMv[i]].data().f.opts.next);
                    view2 = this.turn('view', data.pageMv[i]);

                    view[0] = view[0] && view2[0];
                    view[1] = view[1] && view2[1];
                }

                if (!view[0]) shadow = (data.direction == 'ltr') ? 1 : 2;
                else if (!view[1]) shadow = (data.direction == 'ltr') ? 2 : 1;
                else shadow = 3;

                switch (shadow) {
                    case 1:
                        data.shadow.css({
                            width: pageWidth,
                            height: height,
                            top: 0,
                            left: pageWidth
                        });
                        break;
                    case 2:
                        data.shadow.css({
                            width: pageWidth,
                            height: height,
                            top: 0,
                            left: 0
                        });
                        break;
                    case 3:
                        data.shadow.css({
                            width: width,
                            height: height,
                            top: 0,
                            left: 0
                        });
                        break;
                }

            },

            // Sets the z-index and display property of a page
            // It depends on the current view

            _setPageLoc: function (page) {

                var data = this.data(),
                    view = this.turn('view'),
                    loc = 0;


                if (page == view[0] || page == view[1])
                    loc = 1;
                else if (
                    (data.display == 'single' && page == view[0] + 1) ||
                    (data.display == 'double' && page == view[0] - 2 || page == view[1] + 2)
                )
                    loc = 2;

                if (!this.turn('animating'))
                    switch (loc) {
                        case 1:
                            data.pageWrap[page].css(
                                {
                                    zIndex: data.totalPages,
                                    display: ''
                                });
                            break;
                        case 2:
                            data.pageWrap[page].css(
                                {
                                    zIndex: data.totalPages - 1,
                                    display: ''
                                });
                            break;
                        case 0:
                            data.pageWrap[page].css(
                                {
                                    zIndex: 0,
                                    display: (data.pageObjs[page].hasClass('fixed')) ? '' : 'none'
                                }
                            );
                            break;
                    }

                return loc;
            },

            // Gets and sets the options

            options: function (options) {

                if (options === undefined) {

                    return this.data().opts;

                } else {

                    var data = this.data();

                    // Set new values

                    $.extend(data.opts, options);

                    // Set pages

                    if (options.pages)
                        this.turn('pages', options.pages);

                    // Set page

                    if (options.page)
                        this.turn('page', options.page);

                    // Set display

                    if (options.display)
                        this.turn('display', options.display);

                    // Set direction

                    if (options.direction)
                        this.turn('direction', options.direction);

                    // Set size

                    if (options.width && options.height)
                        this.turn('size', options.width, options.height);

                    // Add event listeners

                    if (options.when)
                        for (var eventName in options.when)
                            if (has(eventName, options.when)) {
                                this.unbind(eventName).bind(eventName, options.when[eventName]);
                            }

                    return this;
                }

            },

            // Gets the current version

            version: function () {

                return version;

            }
        },

// Methods and properties for the flip page effect

        flipMethods = {

            // Constructor

            init: function (opts) {

                this.data({
                    f: {
                        disabled: false,
                        hover: false,
                        effect: (this.hasClass('hard')) ? 'hard' : 'sheet'
                    }
                });

                this.flip('options', opts);

                flipMethods._addPageWrapper.call(this);

                return this;
            },

            setData: function (d) {

                var data = this.data();

                data.f = $.extend(data.f, d);

                return this;
            },

            options: function (opts) {

                var data = this.data().f;

                if (opts) {
                    flipMethods.setData.call(this,
                        {opts: $.extend({}, data.opts || flipOptions, opts)});
                    return this;
                } else
                    return data.opts;

            },

            z: function (z) {

                var data = this.data().f;

                data.opts['z-index'] = z;

                if (data.fwrapper)
                    data.fwrapper.css({
                        zIndex: z || parseInt(data.parent.css('z-index'), 10) || 0
                    });

                return this;
            },

            _cAllowed: function () {

                var data = this.data().f,
                    page = data.opts.page,
                    turnData = data.opts.turn.data(),
                    odd = page % 2;

                if (data.effect == 'hard') {

                    return (turnData.direction == 'ltr') ?
                        [(odd) ? 'r' : 'l'] :
                        [(odd) ? 'l' : 'r'];

                } else {

                    if (turnData.display == 'single') {

                        if (page == 1)
                            return (turnData.direction == 'ltr') ?
                                corners['forward'] : corners['backward'];
                        else if (page == turnData.totalPages)
                            return (turnData.direction == 'ltr') ?
                                corners['backward'] : corners['forward'];
                        else
                            return corners['all'];

                    } else {

                        return (turnData.direction == 'ltr') ?
                            corners[(odd) ? 'forward' : 'backward']
                            :
                            corners[(odd) ? 'backward' : 'forward'];

                    }

                }

            },

            _cornerActivated: function (p) {

                var data = this.data().f,
                    width = this.width(),
                    height = this.height(),
                    point = {x: p.x, y: p.y, corner: ''},
                    csz = data.opts.cornerSize;

                if (point.x <= 0 || point.y <= 0 || point.x >= width || point.y >= height)
                    return false;

                var allowedCorners = flipMethods._cAllowed.call(this);

                switch (data.effect) {
                    case 'hard':

                        if (point.x > width - csz)
                            point.corner = 'r';
                        else if (point.x < csz)
                            point.corner = 'l';
                        else
                            return false;

                        break;

                    case 'sheet':

                        if (point.y < csz)
                            point.corner += 't';
                        else if (point.y >= height - csz)
                            point.corner += 'b';
                        else
                            return false;

                        if (point.x <= csz)
                            point.corner += 'l';
                        else if (point.x >= width - csz)
                            point.corner += 'r';
                        else
                            return false;

                        break;
                }

                return (!point.corner || $.inArray(point.corner, allowedCorners) == -1) ?
                    false : point;

            },

            _isIArea: function (e) {

                var pos = this.data().f.parent.offset();

                e = (isTouch && e.originalEvent) ? e.originalEvent.touches[0] : e;

                var cornerActivated = flipMethods._cornerActivated.call(this,
                    {
                        x: e.pageX - pos.left,
                        y: e.pageY - pos.top
                    });

                return cornerActivated;

            },

            _c: function (corner, opts) {

                opts = opts || 0;

                switch (corner) {
                    case 'tl':
                        return point2D(opts, opts);
                    case 'tr':
                        return point2D(this.width() - opts, opts);
                    case 'bl':
                        return point2D(opts, this.height() - opts);
                    case 'br':
                        return point2D(this.width() - opts, this.height() - opts);
                    case 'l':
                        return point2D(opts, 0);
                    case 'r':
                        return point2D(this.width() - opts, 0);
                }

            },

            _c2: function (corner) {

                switch (corner) {
                    case 'tl':
                        return point2D(this.width() * 2, 0);
                    case 'tr':
                        return point2D(-this.width(), 0);
                    case 'bl':
                        return point2D(this.width() * 2, this.height());
                    case 'br':
                        return point2D(-this.width(), this.height());
                    case 'l':
                        return point2D(this.width() * 2, 0);
                    case 'r':
                        return point2D(-this.width(), 0);
                }

            },

            _foldingPage: function () {

                var data = this.data().f;

                if (!data)
                    return;

                var opts = data.opts;

                if (opts.turn) {
                    data = opts.turn.data();
                    if (data.display == 'single')
                        return (opts.next > 1 || opts.page > 1) ? data.pageObjs[0] : null;
                    else
                        return data.pageObjs[opts.next];
                }

            },

            _backGradient: function () {

                var data = this.data().f,
                    turnData = data.opts.turn.data(),
                    gradient = turnData.opts.gradients && (turnData.display == 'single' ||
                        (data.opts.page != 2 && data.opts.page != turnData.totalPages - 1));

                if (gradient && !data.bshadow)
                    data.bshadow = $('<div/>', divAtt(0, 0, 1)).css({
                        'position': '',
                        width: this.width(),
                        height: this.height()
                    }).appendTo(data.parent);

                return gradient;

            },

            type: function () {

                return this.data().f.effect;

            },

            resize: function (full) {

                var data = this.data().f,
                    turnData = data.opts.turn.data(),
                    width = this.width(),
                    height = this.height();

                switch (data.effect) {
                    case 'hard':

                        if (full) {
                            data.wrapper.css({width: width, height: height});
                            data.fpage.css({width: width, height: height});
                            if (turnData.opts.gradients) {
                                data.ashadow.css({width: width, height: height});
                                data.bshadow.css({width: width, height: height});
                            }
                        }

                        break;
                    case 'sheet':

                        if (full) {
                            var size = Math.round(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));

                            data.wrapper.css({width: size, height: size});
                            data.fwrapper.css({width: size, height: size}).children(':first-child').css({
                                width: width,
                                height: height
                            });

                            data.fpage.css({width: width, height: height});

                            if (turnData.opts.gradients)
                                data.ashadow.css({width: width, height: height});

                            if (flipMethods._backGradient.call(this))
                                data.bshadow.css({width: width, height: height});
                        }

                        if (data.parent.is(':visible')) {
                            var offset = findPos(data.parent[0]);

                            data.fwrapper.css({
                                top: offset.top,
                                left: offset.left
                            });

                            //if (data.opts.turn) {
                            offset = findPos(data.opts.turn[0]);
                            data.fparent.css({top: -offset.top, left: -offset.left});
                            //}
                        }

                        this.flip('z', data.opts['z-index']);

                        break;
                }

            },

            // Prepares the page by adding a general wrapper and another objects

            _addPageWrapper: function () {

                var att,
                    data = this.data().f,
                    turnData = data.opts.turn.data(),
                    parent = this.parent();

                data.parent = parent;

                if (!data.wrapper)
                    switch (data.effect) {
                        case 'hard':

                            var cssProperties = {};
                            cssProperties[vendor + 'transform-style'] = 'preserve-3d';
                            cssProperties[vendor + 'backface-visibility'] = 'hidden';

                            data.wrapper = $('<div/>', divAtt(0, 0, 2)).css(cssProperties).appendTo(parent).prepend(this);

                            data.fpage = $('<div/>', divAtt(0, 0, 1)).css(cssProperties).appendTo(parent);

                            if (turnData.opts.gradients) {
                                data.ashadow = $('<div/>', divAtt(0, 0, 0)).hide().appendTo(parent);

                                data.bshadow = $('<div/>', divAtt(0, 0, 0));
                            }

                            break;
                        case 'sheet':

                            var width = this.width(),
                                height = this.height(),
                                size = Math.round(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));

                            data.fparent = data.opts.turn.data().fparent;

                            if (!data.fparent) {
                                var fparent = $('<div/>', {css: {'pointer-events': 'none'}}).hide();
                                fparent.data().flips = 0;
                                fparent.css(divAtt(0, 0, 'auto', 'visible').css).appendTo(data.opts.turn);

                                data.opts.turn.data().fparent = fparent;
                                data.fparent = fparent;
                            }

                            this.css({position: 'absolute', top: 0, left: 0, bottom: 'auto', right: 'auto'});

                            data.wrapper = $('<div/>', divAtt(0, 0, this.css('z-index'))).appendTo(parent).prepend(this);

                            data.fwrapper = $('<div/>', divAtt(parent.offset().top, parent.offset().left)).hide().appendTo(data.fparent);

                            data.fpage = $('<div/>', divAtt(0, 0, 0, 'visible')).css({cursor: 'default'}).appendTo(data.fwrapper);

                            if (turnData.opts.gradients)
                                data.ashadow = $('<div/>', divAtt(0, 0, 1)).appendTo(data.fpage);

                            flipMethods.setData.call(this, data);

                            break;
                    }

                // Set size
                flipMethods.resize.call(this, true);

            },

            // Takes a 2P point from the screen and applies the transformation

            _fold: function (point) {

                var data = this.data().f,
                    turnData = data.opts.turn.data(),
                    o = flipMethods._c.call(this, point.corner),
                    width = this.width(),
                    height = this.height();

                switch (data.effect) {

                    case 'hard':

                        if (point.corner == 'l')
                            point.x = Math.min(Math.max(point.x, 0), width * 2);
                        else
                            point.x = Math.max(Math.min(point.x, width), -width);

                        var leftPos,
                            shadow,
                            gradientX,
                            fpageOrigin,
                            parentOrigin,
                            totalPages = turnData.totalPages,
                            zIndex = data.opts['z-index'] || totalPages,
                            parentCss = {'overflow': 'visible'},
                            relX = (o.x) ? (o.x - point.x) / width : point.x / width,
                            angle = relX * 90,
                            half = angle < 90;

                        switch (point.corner) {
                            case 'l':

                                fpageOrigin = '0% 50%';
                                parentOrigin = '100% 50%';

                                if (half) {
                                    leftPos = 0;
                                    shadow = data.opts.next - 1 > 0;
                                    gradientX = 1;
                                } else {
                                    leftPos = '100%';
                                    shadow = data.opts.page + 1 < totalPages;
                                    gradientX = 0;
                                }

                                break;
                            case 'r':

                                fpageOrigin = '100% 50%';
                                parentOrigin = '0% 50%';
                                angle = -angle;
                                width = -width;

                                if (half) {
                                    leftPos = 0;
                                    shadow = data.opts.next + 1 < totalPages;
                                    gradientX = 0;
                                } else {
                                    leftPos = '-100%';
                                    shadow = data.opts.page != 1;
                                    gradientX = 1;
                                }

                                break;
                        }

                        parentCss[vendor + 'perspective-origin'] = parentOrigin;

                        data.wrapper.transform('rotateY(' + angle + 'deg)' +
                            'translate3d(0px, 0px, ' + (this.attr('depth') || 0) + 'px)', parentOrigin);

                        data.fpage.transform('translateX(' + width + 'px) rotateY(' + (180 + angle) + 'deg)', fpageOrigin);

                        data.parent.css(parentCss);

                        if (half) {
                            relX = -relX + 1;
                            data.wrapper.css({zIndex: zIndex + 1});
                            data.fpage.css({zIndex: zIndex});
                        } else {
                            relX = relX - 1;
                            data.wrapper.css({zIndex: zIndex});
                            data.fpage.css({zIndex: zIndex + 1});
                        }

                        if (turnData.opts.gradients) {
                            if (shadow)
                                data.ashadow.css({
                                    display: '',
                                    left: leftPos,
                                    backgroundColor: 'rgba(0,0,0,' + (0.5 * relX) + ')'
                                }).transform('rotateY(0deg)');
                            else
                                data.ashadow.hide();

                            data.bshadow.css({opacity: -relX + 1});

                            if (half) {
                                if (data.bshadow.parent()[0] != data.wrapper[0]) {
                                    data.bshadow.appendTo(data.wrapper);
                                }
                            } else {
                                if (data.bshadow.parent()[0] != data.fpage[0]) {
                                    data.bshadow.appendTo(data.fpage);
                                }
                            }
                            /*data.bshadow.css({
            backgroundColor: 'rgba(0,0,0,'+(0.1)+')'
          })*/
                            gradient(data.bshadow, point2D(gradientX * 100, 0), point2D((-gradientX + 1) * 100, 0),
                                [[0, 'rgba(0,0,0,0.3)'], [1, 'rgba(0,0,0,0)']], 2);

                        }

                        break;
                    case 'sheet':

                        var that = this,
                            a = 0,
                            alpha = 0,
                            beta,
                            px,
                            gradientEndPointA,
                            gradientEndPointB,
                            gradientStartVal,
                            gradientSize,
                            gradientOpacity,
                            shadowVal,
                            mv = point2D(0, 0),
                            df = point2D(0, 0),
                            tr = point2D(0, 0),
                            folding = flipMethods._foldingPage.call(this),
                            tan = Math.tan(alpha),
                            ac = turnData.opts.acceleration,
                            h = data.wrapper.height(),
                            top = point.corner.substr(0, 1) == 't',
                            left = point.corner.substr(1, 1) == 'l',

                            compute = function () {

                                var rel = point2D(0, 0);
                                var middle = point2D(0, 0);

                                rel.x = (o.x) ? o.x - point.x : point.x;

                                if (!hasRot) {
                                    rel.y = 0;
                                } else {
                                    rel.y = (o.y) ? o.y - point.y : point.y;
                                }

                                middle.x = (left) ? width - rel.x / 2 : point.x + rel.x / 2;
                                middle.y = rel.y / 2;

                                var alpha = A90 - Math.atan2(rel.y, rel.x),
                                    gamma = alpha - Math.atan2(middle.y, middle.x),
                                    distance = Math.max(0, Math.sin(gamma) * Math.sqrt(Math.pow(middle.x, 2) + Math.pow(middle.y, 2)));

                                a = deg(alpha);

                                tr = point2D(distance * Math.sin(alpha), distance * Math.cos(alpha));

                                if (alpha > A90) {
                                    tr.x = tr.x + Math.abs(tr.y * rel.y / rel.x);
                                    tr.y = 0;
                                    if (Math.round(tr.x * Math.tan(PI - alpha)) < height) {
                                        point.y = Math.sqrt(Math.pow(height, 2) + 2 * middle.x * rel.x);
                                        if (top) point.y = height - point.y;
                                        return compute();
                                    }
                                }

                                if (alpha > A90) {
                                    var beta = PI - alpha, dd = h - height / Math.sin(beta);
                                    mv = point2D(Math.round(dd * Math.cos(beta)), Math.round(dd * Math.sin(beta)));
                                    if (left) mv.x = -mv.x;
                                    if (top) mv.y = -mv.y;
                                }

                                px = Math.round(tr.y / Math.tan(alpha) + tr.x);

                                var side = width - px,
                                    sideX = side * Math.cos(alpha * 2),
                                    sideY = side * Math.sin(alpha * 2);
                                df = point2D(
                                    Math.round((left ? side - sideX : px + sideX)),
                                    Math.round((top) ? sideY : height - sideY));

                                // Gradients
                                if (turnData.opts.gradients) {

                                    gradientSize = side * Math.sin(alpha);

                                    var endingPoint = flipMethods._c2.call(that, point.corner),
                                        far = Math.sqrt(Math.pow(endingPoint.x - point.x, 2) + Math.pow(endingPoint.y - point.y, 2)) / width;

                                    shadowVal = Math.sin(A90 * ((far > 1) ? 2 - far : far));

                                    gradientOpacity = Math.min(far, 1);


                                    gradientStartVal = gradientSize > 100 ? (gradientSize - 100) / gradientSize : 0;

                                    gradientEndPointA = point2D(
                                        gradientSize * Math.sin(alpha) / width * 100,
                                        gradientSize * Math.cos(alpha) / height * 100);


                                    if (flipMethods._backGradient.call(that)) {

                                        gradientEndPointB = point2D(
                                            gradientSize * 1.2 * Math.sin(alpha) / width * 100,
                                            gradientSize * 1.2 * Math.cos(alpha) / height * 100);

                                        if (!left) gradientEndPointB.x = 100 - gradientEndPointB.x;
                                        if (!top) gradientEndPointB.y = 100 - gradientEndPointB.y;

                                    }

                                }

                                tr.x = Math.round(tr.x);
                                tr.y = Math.round(tr.y);

                                return true;
                            },

                            transform = function (tr, c, x, a) {

                                var f = ['0', 'auto'], mvW = (width - h) * x[0] / 100, mvH = (height - h) * x[1] / 100,
                                    cssA = {left: f[c[0]], top: f[c[1]], right: f[c[2]], bottom: f[c[3]]},
                                    cssB = {},
                                    aliasingFk = (a != 90 && a != -90) ? (left ? -1 : 1) : 0,
                                    origin = x[0] + '% ' + x[1] + '%';

                                that.css(cssA).transform(rotate(a) + translate(tr.x + aliasingFk, tr.y, ac), origin);

                                data.fpage.css(cssA).transform(
                                    rotate(a) +
                                    translate(tr.x + df.x - mv.x - width * x[0] / 100, tr.y + df.y - mv.y - height * x[1] / 100, ac) +
                                    rotate((180 / a - 2) * a),
                                    origin);

                                data.wrapper.transform(translate(-tr.x + mvW - aliasingFk, -tr.y + mvH, ac) + rotate(-a), origin);

                                data.fwrapper.transform(translate(-tr.x + mv.x + mvW, -tr.y + mv.y + mvH, ac) + rotate(-a), origin);

                                if (turnData.opts.gradients) {

                                    if (x[0])
                                        gradientEndPointA.x = 100 - gradientEndPointA.x;

                                    if (x[1])
                                        gradientEndPointA.y = (100 - gradientEndPointA.y);

                                    cssB['box-shadow'] = '0 0 20px rgba(0,0,0,' + (0.5 * shadowVal) + ')';
                                    folding.css(cssB);

                                    gradient(data.ashadow,
                                        point2D(left ? 100 : 0, top ? 0 : 100),
                                        point2D(gradientEndPointA.x, gradientEndPointA.y),
                                        [[gradientStartVal, 'rgba(0,0,0,0)'],
                                            [((1 - gradientStartVal) * 0.8) + gradientStartVal, 'rgba(0,0,0,' + (0.2 * gradientOpacity) + ')'],
                                            [1, 'rgba(255,255,255,' + (0.2 * gradientOpacity) + ')']],
                                        3,
                                        alpha);

                                    if (flipMethods._backGradient.call(that))
                                        gradient(data.bshadow,
                                            point2D(left ? 0 : 100, top ? 0 : 100),
                                            point2D(gradientEndPointB.x, gradientEndPointB.y),
                                            [[0.6, 'rgba(0,0,0,0)'],
                                                [0.8, 'rgba(0,0,0,' + (0.3 * gradientOpacity) + ')'],
                                                [1, 'rgba(0,0,0,0)']
                                            ],
                                            3);
                                }

                            };

                        switch (point.corner) {
                            case 'l' :

                                break;
                            case 'r' :

                                break;
                            case 'tl' :
                                point.x = Math.max(point.x, 1);
                                compute();
                                transform(tr, [1, 0, 0, 1], [100, 0], a);
                                break;
                            case 'tr' :
                                point.x = Math.min(point.x, width - 1);
                                compute();
                                transform(point2D(-tr.x, tr.y), [0, 0, 0, 1], [0, 0], -a);
                                break;
                            case 'bl' :
                                point.x = Math.max(point.x, 1);
                                compute();
                                transform(point2D(tr.x, -tr.y), [1, 1, 0, 0], [100, 100], -a);
                                break;
                            case 'br' :
                                point.x = Math.min(point.x, width - 1);
                                compute();
                                transform(point2D(-tr.x, -tr.y), [0, 1, 1, 0], [0, 100], a);
                                break;
                        }

                        break;
                }

                data.point = point;
            },

            _moveFoldingPage: function (move) {

                var data = this.data().f;

                if (!data)
                    return;

                var turn = data.opts.turn,
                    turnData = turn.data(),
                    place = turnData.pagePlace;

                if (move) {

                    var nextPage = data.opts.next;

                    if (place[nextPage] != data.opts.page) {

                        if (data.folding)
                            flipMethods._moveFoldingPage.call(this, false);

                        var folding = flipMethods._foldingPage.call(this);

                        folding.appendTo(data.fpage);
                        place[nextPage] = data.opts.page;
                        data.folding = nextPage;
                    }

                    turn.turn('update');

                } else {

                    if (data.folding) {

                        if (turnData.pages[data.folding]) {

                            // If we have flip available

                            var flipData = turnData.pages[data.folding].data().f;

                            turnData.pageObjs[data.folding].appendTo(flipData.wrapper);

                        } else if (turnData.pageWrap[data.folding]) {

                            // If we have the pageWrapper

                            turnData.pageObjs[data.folding].appendTo(turnData.pageWrap[data.folding]);

                        }

                        if (data.folding in place) {
                            place[data.folding] = data.folding;
                        }

                        delete data.folding;

                    }
                }
            },

            _showFoldedPage: function (c, animate) {

                var folding = flipMethods._foldingPage.call(this),
                    dd = this.data(),
                    data = dd.f,
                    visible = data.visible;

                if (folding) {

                    if (!visible || !data.point || data.point.corner != c.corner) {

                        var corner = (
                            data.status == 'hover' ||
                            data.status == 'peel' ||
                            data.opts.turn.data().mouseAction) ?
                            c.corner : null;

                        visible = false;

                        if (trigger('start', this, [data.opts, corner]) == 'prevented')
                            return false;

                    }

                    if (animate) {

                        var that = this,
                            point = (data.point && data.point.corner == c.corner) ?
                                data.point : flipMethods._c.call(this, c.corner, 1);

                        this.animatef({
                            from: [point.x, point.y],
                            to: [c.x, c.y],
                            duration: 500,
                            frame: function (v) {
                                c.x = Math.round(v[0]);
                                c.y = Math.round(v[1]);
                                flipMethods._fold.call(that, c);
                            }
                        });

                    } else {

                        flipMethods._fold.call(this, c);

                        if (dd.effect && !dd.effect.turning)
                            this.animatef(false);

                    }

                    if (!visible) {

                        switch (data.effect) {
                            case 'hard':

                                data.visible = true;
                                flipMethods._moveFoldingPage.call(this, true);
                                data.fpage.show();
                                if (data.opts.shadows)
                                    data.bshadow.show();

                                break;
                            case 'sheet':

                                data.visible = true;
                                data.fparent.show().data().flips++;
                                flipMethods._moveFoldingPage.call(this, true);
                                data.fwrapper.show();
                                if (data.bshadow)
                                    data.bshadow.show();

                                break;
                        }

                    }

                    return true;

                }

                return false;
            },

            hide: function () {

                var data = this.data().f,
                    turnData = data.opts.turn.data(),
                    folding = flipMethods._foldingPage.call(this);

                switch (data.effect) {
                    case 'hard':

                        if (turnData.opts.gradients) {
                            data.bshadowLoc = 0;
                            data.bshadow.remove();
                            data.ashadow.hide();
                        }

                        data.wrapper.transform('');
                        data.fpage.hide();

                        break;
                    case 'sheet':

                        if ((--data.fparent.data().flips) === 0)
                            data.fparent.hide();

                        this.css({left: 0, top: 0, right: 'auto', bottom: 'auto'}).transform('');

                        data.wrapper.transform('');

                        data.fwrapper.hide();

                        if (data.bshadow)
                            data.bshadow.hide();

                        folding.transform('');

                        break;
                }

                data.visible = false;

                return this;
            },

            hideFoldedPage: function (animate) {

                var data = this.data().f;

                if (!data.point) return;

                var that = this,
                    p1 = data.point,
                    hide = function () {
                        data.point = null;
                        data.status = '';
                        that.flip('hide');
                        that.trigger('end', [data.opts, false]);
                    };

                if (animate) {

                    var p4 = flipMethods._c.call(this, p1.corner),
                        top = (p1.corner.substr(0, 1) == 't'),
                        delta = (top) ? Math.min(0, p1.y - p4.y) / 2 : Math.max(0, p1.y - p4.y) / 2,
                        p2 = point2D(p1.x, p1.y + delta),
                        p3 = point2D(p4.x, p4.y - delta);

                    this.animatef({
                        from: 0,
                        to: 1,
                        frame: function (v) {
                            var np = bezier(p1, p2, p3, p4, v);
                            p1.x = np.x;
                            p1.y = np.y;
                            flipMethods._fold.call(that, p1);
                        },
                        complete: hide,
                        duration: 800,
                        hiding: true
                    });

                } else {

                    this.animatef(false);
                    hide();

                }
            },

            turnPage: function (corner) {

                var that = this,
                    data = this.data().f,
                    turnData = data.opts.turn.data();

                corner = {
                    corner: (data.corner) ?
                        data.corner.corner :
                        corner || flipMethods._cAllowed.call(this)[0]
                };

                var p1 = data.point ||
                    flipMethods._c.call(this,
                        corner.corner,
                        (data.opts.turn) ? turnData.opts.elevation : 0),
                    p4 = flipMethods._c2.call(this, corner.corner);

                this.trigger('flip').animatef({
                    from: 0,
                    to: 1,
                    frame: function (v) {

                        var np = bezier(p1, p1, p4, p4, v);
                        corner.x = np.x;
                        corner.y = np.y;
                        flipMethods._showFoldedPage.call(that, corner);

                    },
                    complete: function () {

                        that.trigger('end', [data.opts, true]);

                    },
                    duration: turnData.opts.duration,
                    turning: true
                });

                data.corner = null;
            },

            moving: function () {

                return 'effect' in this.data();

            },

            isTurning: function () {

                return this.flip('moving') && this.data().effect.turning;

            },

            corner: function () {

                return this.data().f.corner;

            },

            _eventStart: function (e) {

                var data = this.data().f,
                    turn = data.opts.turn;

                if (!data.corner && !data.disabled && !this.flip('isTurning') &&
                    data.opts.page == turn.data().pagePlace[data.opts.page]) {

                    data.corner = flipMethods._isIArea.call(this, e);

                    if (data.corner && flipMethods._foldingPage.call(this)) {

                        this.trigger('pressed', [data.point]);
                        flipMethods._showFoldedPage.call(this, data.corner);

                        return false;

                    } else
                        data.corner = null;

                }

            },

            _eventMove: function (e) {

                var data = this.data().f;

                if (!data.disabled) {

                    e = (isTouch) ? e.originalEvent.touches : [e];

                    if (data.corner) {

                        var pos = data.parent.offset();
                        data.corner.x = e[0].pageX - pos.left;
                        data.corner.y = e[0].pageY - pos.top;
                        flipMethods._showFoldedPage.call(this, data.corner);

                    } else if (data.hover && !this.data().effect && this.is(':visible')) {

                        var point = flipMethods._isIArea.call(this, e[0]);

                        if (point) {

                            if ((data.effect == 'sheet' && point.corner.length == 2) || data.effect == 'hard') {
                                data.status = 'hover';
                                var origin = flipMethods._c.call(this, point.corner, data.opts.cornerSize / 2);
                                point.x = origin.x;
                                point.y = origin.y;
                                flipMethods._showFoldedPage.call(this, point, true);
                                if (point.corner === 'tr') {
                                    $(`.page-num-${currentPage} .neg-line`).removeClass('show');
                                    $(`.page-num-${currentPage} .pos-line`).addClass('show');

                                    choiceId = 0;
                                    console.log("choiceId: " + choiceId);
                                } else if (point.corner === 'br') {
                                    $(`.page-num-${currentPage} .pos-line`).removeClass('show');
                                    $(`.page-num-${currentPage} .neg-line`).addClass('show');

                                    console.log("choiceId: " + choiceId);
                                    choiceId = 1;
                                }
                            }

                        } else {

                            if (data.status == 'hover') {
                                data.status = '';
                                // $('.notification-top').removeClass('show');
                                // $('.notification-bot').removeClass('show');
                                $(`.page-num-${currentPage} .pos-line`).removeClass('show');
                                $(`.page-num-${currentPage} .neg-line`).removeClass('show');
                                flipMethods.hideFoldedPage.call(this, true);
                            }

                        }

                    }

                }

            },

            _eventEnd: function () {

                var data = this.data().f,
                    corner = data.corner;

                if (!data.disabled && corner) {
                    if (trigger('released', this, [data.point || corner]) != 'prevented') {
                        flipMethods.hideFoldedPage.call(this, true);
                    }
                }

                data.corner = null;

            },

            disable: function (disable) {

                flipMethods.setData.call(this, {'disabled': disable});
                return this;

            },

            hover: function (hover) {

                flipMethods.setData.call(this, {'hover': hover});
                return this;

            },

            peel: function (corner, animate) {

                var data = this.data().f;

                if (corner) {

                    if ($.inArray(corner, corners.all) == -1)
                        throw turnError('Corner ' + corner + ' is not permitted');

                    if ($.inArray(corner, flipMethods._cAllowed.call(this)) != -1) {

                        var point = flipMethods._c.call(this, corner, data.opts.cornerSize / 2);

                        data.status = 'peel';

                        flipMethods._showFoldedPage.call(this,
                            {
                                corner: corner,
                                x: point.x,
                                y: point.y
                            }, animate);

                    }


                } else {

                    data.status = '';

                    flipMethods.hideFoldedPage.call(this, animate);

                }

                return this;
            }
        };


// Processes classes

    function dec(that, methods, args) {

        if (!args[0] || typeof(args[0]) == 'object')
            return methods.init.apply(that, args);

        else if (methods[args[0]])
            return methods[args[0]].apply(that, Array.prototype.slice.call(args, 1));

        else
            throw turnError(args[0] + ' is not a method or property');

    }


// Attributes for a layer

    function divAtt(top, left, zIndex, overf) {

        return {
            'css': {
                position: 'absolute',
                top: top,
                left: left,
                'overflow': overf || 'hidden',
                zIndex: zIndex || 'auto'
            }
        };

    }

// Gets a 2D point from a bezier curve of four points

    function bezier(p1, p2, p3, p4, t) {

        var a = 1 - t,
            b = a * a * a,
            c = t * t * t;

        return point2D(Math.round(b * p1.x + 3 * t * a * a * p2.x + 3 * t * t * a * p3.x + c * p4.x),
            Math.round(b * p1.y + 3 * t * a * a * p2.y + 3 * t * t * a * p3.y + c * p4.y));

    }

// Converts an angle from degrees to radians

    function rad(degrees) {

        return degrees / 180 * PI;

    }

// Converts an angle from radians to degrees

    function deg(radians) {

        return radians / PI * 180;

    }

// Gets a 2D point

    function point2D(x, y) {

        return {x: x, y: y};

    }

// Webkit 534.3 on Android wrongly repaints elements that use overflow:hidden + rotation

    function rotationAvailable() {
        var parts;

        if ((parts = /AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent))) {
            var webkitVersion = parseFloat(parts[1]);
            return (webkitVersion > 534.3);
        } else {
            return true;
        }
    }

// Returns the traslate value

    function translate(x, y, use3d) {

        return (has3d && use3d) ? ' translate3d(' + x + 'px,' + y + 'px, 0px) '
            : ' translate(' + x + 'px, ' + y + 'px) ';

    }

// Returns the rotation value

    function rotate(degrees) {

        return ' rotate(' + degrees + 'deg) ';

    }

// Checks if a property belongs to an object

    function has(property, object) {

        return Object.prototype.hasOwnProperty.call(object, property);

    }

// Gets the CSS3 vendor prefix

    function getPrefix() {

        var vendorPrefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
            len = vendorPrefixes.length,
            vendor = '';

        while (len--)
            if ((vendorPrefixes[len] + 'Transform') in document.body.style)
                vendor = '-' + vendorPrefixes[len].toLowerCase() + '-';

        return vendor;

    }

// Detects the transitionEnd Event

    function getTransitionEnd() {

        var t,
            el = document.createElement('fakeelement'),
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MSTransition': 'transitionend',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

// Gradients

    function gradient(obj, p0, p1, colors, numColors) {

        var j, cols = [];

        if (vendor == '-webkit-') {

            for (j = 0; j < numColors; j++)
                cols.push('color-stop(' + colors[j][0] + ', ' + colors[j][1] + ')');

            obj.css({
                'background-image':
                    '-webkit-gradient(linear, ' +
                    p0.x + '% ' +
                    p0.y + '%,' +
                    p1.x + '% ' +
                    p1.y + '%, ' +
                    cols.join(',') + ' )'
            });
        } else {

            p0 = {x: p0.x / 100 * obj.width(), y: p0.y / 100 * obj.height()};
            p1 = {x: p1.x / 100 * obj.width(), y: p1.y / 100 * obj.height()};

            var dx = p1.x - p0.x,
                dy = p1.y - p0.y,
                angle = Math.atan2(dy, dx),
                angle2 = angle - Math.PI / 2,
                diagonal = Math.abs(obj.width() * Math.sin(angle2)) + Math.abs(obj.height() * Math.cos(angle2)),
                gradientDiagonal = Math.sqrt(dy * dy + dx * dx),
                corner = point2D((p1.x < p0.x) ? obj.width() : 0, (p1.y < p0.y) ? obj.height() : 0),
                slope = Math.tan(angle),
                inverse = -1 / slope,
                x = (inverse * corner.x - corner.y - slope * p0.x + p0.y) / (inverse - slope),
                c = {x: x, y: inverse * x - inverse * corner.x + corner.y},
                segA = (Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)));

            for (j = 0; j < numColors; j++)
                cols.push(' ' + colors[j][1] + ' ' + ((segA + gradientDiagonal * colors[j][0]) * 100 / diagonal) + '%');

            obj.css({'background-image': vendor + 'linear-gradient(' + (-angle) + 'rad,' + cols.join(',') + ')'});
        }
    }


// Triggers an event

    function trigger(eventName, context, args) {

        var event = $.Event(eventName);
        context.trigger(event, args);
        if (event.isDefaultPrevented())
            return 'prevented';
        else if (event.isPropagationStopped())
            return 'stopped';
        else
            return '';
    }

// JS Errors

    function turnError(message) {

        function TurnJsError(message) {
            this.name = "TurnJsError";
            this.message = message;
        }

        TurnJsError.prototype = new Error();
        TurnJsError.prototype.constructor = TurnJsError;
        return new TurnJsError(message);

    }

// Find the offset of an element ignoring its transformation

    function findPos(obj) {

        var offset = {top: 0, left: 0};

        do {
            offset.left += obj.offsetLeft;
            offset.top += obj.offsetTop;
        } while ((obj = obj.offsetParent));

        return offset;

    }

// Checks if there's hard page compatibility
// IE9 is the only browser that does not support hard pages

    function hasHardPage() {
        return (navigator.userAgent.indexOf('MSIE 9.0') == -1);
    }

// Request an animation

    window.requestAnim = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

    })();

// Extend $.fn

    $.extend($.fn, {

        flip: function () {
            return dec($(this[0]), flipMethods, arguments);
        },

        turn: function () {
            return dec($(this[0]), turnMethods, arguments);
        },

        transform: function (transform, origin) {

            var properties = {};

            if (origin)
                properties[vendor + 'transform-origin'] = origin;

            properties[vendor + 'transform'] = transform;

            return this.css(properties);

        },

        animatef: function (point) {

            var data = this.data();

            if (data.effect)
                data.effect.stop();

            if (point) {

                if (!point.to.length) point.to = [point.to];
                if (!point.from.length) point.from = [point.from];

                var diff = [],
                    len = point.to.length,
                    animating = true,
                    that = this,
                    time = (new Date()).getTime(),
                    frame = function () {

                        if (!data.effect || !animating)
                            return;

                        var v = [],
                            timeDiff = Math.min(point.duration, (new Date()).getTime() - time);

                        for (var i = 0; i < len; i++)
                            v.push(data.effect.easing(1, timeDiff, point.from[i], diff[i], point.duration));

                        point.frame((len == 1) ? v[0] : v);

                        if (timeDiff == point.duration) {
                            delete data['effect'];
                            that.data(data);
                            if (point.complete)
                                point.complete();
                        } else {
                            window.requestAnim(frame);
                        }
                    };

                for (var i = 0; i < len; i++)
                    diff.push(point.to[i] - point.from[i]);

                data.effect = $.extend({
                    stop: function () {
                        animating = false;
                    },
                    easing: function (x, t, b, c, data) {
                        return c * Math.sqrt(1 - (t = t / data - 1) * t) + b;
                    }
                }, point);

                this.data(data);

                frame();

            } else {

                delete data['effect'];

            }
        }
    });

// Export some globals

    $.isTouch = isTouch;
    $.mouseEvents = mouseEvents;
    $.cssPrefix = getPrefix;
    $.cssTransitionEnd = getTransitionEnd;
    $.findPos = findPos;

})(jQuery);

async function getCharacterNo(callback){
    if (!window.contract) {
        console.error("Contract is not set!");
        return;
    }

    const contract = await tronWeb.contract().at("41468fb3338cb63e698a5dca8094e201903b561857");
    let res = await contract.getCharacterNo().call();
    callback && callback(res);
}

async function getCharaDetails(charaId, callback){
    if (!window.contract) {
        console.error("Contract is not set!");
        return;
    }

    const contract = await tronWeb.contract().at("41468fb3338cb63e698a5dca8094e201903b561857");
    let res = await contract.getCharacterDetails(parseInt(charaId)).call();
    callback && callback(res);
}

async function insertCharacter(charaToInsert, callback) {
    if (!window.contract) {
        console.error("Contract is not set!");
        return;
    }

    console.error(charaToInsert.name);
    console.error(parseInt(charaToInsert.spirit));
    console.error(parseInt(charaToInsert.gold));
    console.error(parseInt(charaToInsert.power));
    console.error(parseInt(charaToInsert.agility));
    console.error(parseInt(charaToInsert.intelligence));
    console.error(parseInt(charaToInsert.goodness));
    console.error(parseInt(charaToInsert.fatigue));
    console.error(parseInt(charaToInsert.fatigue));

    const contract = await tronWeb.contract().at("41468fb3338cb63e698a5dca8094e201903b561857");
    let res = await contract.insertCharacter(
        charaToInsert.name,
        parseInt(charaToInsert.spirit),
        parseInt(charaToInsert.gold),
        parseInt(charaToInsert.power),
        parseInt(charaToInsert.agility),
        parseInt(charaToInsert.intelligence),
        parseInt(charaToInsert.goodness),
        parseInt(charaToInsert.fatigue),
        0
    ).send();
    callback && callback(res);
}


$(window).ready(function () {

    setTimeout(function(){
        $('.foreground').addClass('slide-out-fwd-center');
    }, 2000);

    setTimeout(function(){
        $('.foreground').css('display', 'none');
    }, 4000);

    setTimeout(function(){
        $('.book-wrapper').addClass('slide-in-elliptic-top-fwd');
    }, 4000);

    $(".button").click(function () {
        console.error("Clicked...");
        // animateElems();

        // getCharacterNo((res) => {
        //     console.warn("Res of getCharacterNo:");
        //     console.warn(res);
        // });

        // getCharaDetails(3, (res) => {
        //     console.warn("Res of getCharaDetails:");
        //     console.warn(res);
        // });

        // insertCharacter(new Player("TestPlayer"), (res) => {
        //     console.warn("Res of insert player:");
        //     console.warn(res);
        // });

        soundMap["page"].play();

    });

    initModels().then(function () {
        //init pages
        currentEvent = eventMap[STAGE_IDS[0]];
        addPage(currentEvent, false);
        addDummyPage(false);
        // addDummyPage(false);

        let width = 800;
        let height = 575;
        if (isMobile()) {
            width = 600;
            height = 431;
        }

        $('.pages').turn({
            duration: 500,
            width: width,
            height: height,
            // acceleration: true,
            // display: 'double',
            autoCenter: true,
            turnCorners: "bl, br",
            elevation: 300,
            when: {
                turned: function (e, page) {
                    // let lastEvent = null;
                    // if (currentPage > 1 && currentEvents.length > 0) {
                    //     lastEvent = currentEvents.shift();
                    // }
                    //
                    // if (lastEvent !== null && lastEvent.type === EventType.STAGE) {
                    //     currentLevel++;
                    // }
                    //
                    // console.log("lastEvent: ", lastEvent);
                    console.log("currentMaxPage:", currentMaxPage);
                    currentPage = currentMaxPage - 1;
                    soundMap["page"].play();
                    // $(`.page-num-${currentPage} .to-fade`).addClass('fade-in');
                },
                flip: function (e, page) {
                    console.log("flipping ...");
                    $(`.page-num-${currentPage} .pos-line`).removeClass('show');
                    $(`.page-num-${currentPage} .neg-line`).removeClass('show');
                    updateScene();
                }
            }
        });
    });
});