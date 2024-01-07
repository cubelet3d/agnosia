let mobileUI = false; 
let currentNonce; // user's transaction nonce 
let usePrivateKey = false;

// Stuff to preload 
const assets = {
    background: {
        src: '../img/agnosia.gif',
        img: new Image()
    },
    logo: {
        src: '../img/logo.png',
        img: new Image()
    },
    icon1: {
        src: '../img/android-chrome-192x192.png',
        img: new Image()
    },
    icon2: {
        src: '../img/android-chrome-256x256.png',
        img: new Image()
    },
    icon3: {
        src: '../img/apple-touch-icon.png',
        img: new Image()
    },
    icon4: {
        src: '../img/card-back.png',
        img: new Image()
    },
    icon5: {
        src: '../img/favicon.ico',
        img: new Image()
    },
    icon6: {
        src: '../img/favicon-16x16.png',
        img: new Image()
    },
    icon7: {
        src: '../img/favicon-32x32.png',
        img: new Image()
    },
    icon8: {
        src: '../img/hand2.png',
        img: new Image()
    },
    icon9: {
        src: '../img/ladle.png',
        img: new Image()
    },
    icon10: {
        src: '../img/loading.gif',
        img: new Image()
    },
    icon11: {
        src: '../img/mstile-150x150.png',
        img: new Image()
    },
    icon12: {
        src: '../img/skull.png',
        img: new Image()
    },
    audio1: {
        src: '../sounds/sfx/button_hover.wav',
        obj: new Audio()
    },
    audio2: {
        src: '../sounds/sfx/button_press.wav',
        obj: new Audio()
    },
    audio3: {
        src: '../sounds/sfx/card_flip_01.wav',
        obj: new Audio()
    },
    audio4: {
        src: '../sounds/sfx/card_flip_02.wav',
        obj: new Audio()
    },
    audio5: {
        src: '../sounds/sfx/card_flip_03.wav',
        obj: new Audio()
    },
    audio6: {
        src: '../sounds/sfx/card_flip_03_rev.wav',
        obj: new Audio()
    },
    audio7: {
        src: '../sounds/sfx/card_place_01.wav',
        obj: new Audio()
    },
    audio8: {
        src: '../sounds/sfx/card_place_02.wav',
        obj: new Audio()
    },
    audio9: {
        src: '../sounds/sfx/card_place_03.wav',
        obj: new Audio()
    },
    audio10: {
        src: '../sounds/sfx/card_place_04.wav',
        obj: new Audio()
    },
    audio11: {
        src: '../sounds/sfx/cauldron_fast.wav',
        obj: new Audio()
    },
    audio12: {
        src: '../sounds/sfx/cauldron_slow.wav',
        obj: new Audio()
    },
    audio13: {
        src: '../sounds/sfx/draw.wav',
        obj: new Audio()
    },
    audio14: {
        src: '../sounds/sfx/error.wav',
        obj: new Audio()
    },
    audio15: {
        src: '../sounds/sfx/ladle_dunk.wav',
        obj: new Audio()
    },
    audio16: {
        src: '../sounds/sfx/ladle_sip.wav',
        obj: new Audio()
    },
    audio17: {
        src: '../sounds/sfx/NewMessage.wav',
        obj: new Audio()
    },
    audio18: {
        src: '../sounds/sfx/new_match_found.wav',
        obj: new Audio()
    },
    audio19: {
        src: '../sounds/sfx/plus.wav',
        obj: new Audio()
    },
    audio20: {
        src: '../sounds/sfx/same.wav',
        obj: new Audio()
    },
    audio21: {
        src: '../sounds/sfx/stone_button_hover.wav',
        obj: new Audio()
    },
    audio22: {
        src: '../sounds/sfx/stone_button_press.wav',
        obj: new Audio()
    },
    audio23: {
        src: '../sounds/sfx/your_turn.wav',
        obj: new Audio()
    },
    audio24: {
        src: '../sounds/sfx/you_lose.wav',
        obj: new Audio()
    },
    audio25: {
        src: '../sounds/sfx/you_win.wav',
        obj: new Audio()
    }
}

// Progress bar logic 
for (let key in assets) {
    if (assets[key].hasOwnProperty('img')) { // If it's an image
        assets[key].img.onload = assetLoaded;
        assets[key].img.onerror = handleError;
        assets[key].img.src = assets[key].src;
    } else if (assets[key].hasOwnProperty('obj')) { // If it's an audio
        assets[key].obj.oncanplaythrough = assetLoaded;
        assets[key].obj.onerror = handleError;
        assets[key].obj.src = assets[key].src;
    }
}

let assetsToLoad = Object.keys(assets).length;
let assetsLoaded = 0;

function assetLoaded() {
    assetsLoaded++;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = (assetsLoaded / assetsToLoad) * 100 + '%';

    if (assetsLoaded === assetsToLoad) {
        document.documentElement.classList.remove('loading-active');
		document.getElementById('agnosia-loading-label').style.display = 'none'; 
        document.getElementById('progress-bar-container').style.display = 'none';
    }
}

function handleError(e) {
    console.log('Error loading asset: ', e.target.src);
}

// Loading screen logic 
document.getElementById("playButton").addEventListener("click", function() {
    this.style.display = "none";

    const leftCurtain = document.querySelector('.left-curtain');
    const rightCurtain = document.querySelector('.right-curtain');

    leftCurtain.classList.add('slide-left');
    rightCurtain.classList.add('slide-right');

    leftCurtain.addEventListener('transitionend', function() {
        const loadingDiv = document.querySelector('.agnosia-loading');
        loadingDiv.parentNode.removeChild(loadingDiv);
    });

    tcg_base_startPlaylist(); // Start the playlist 
});

// Determine if mobile or not 
document.addEventListener("DOMContentLoaded", function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
        document.body.classList.add('not-mobile');
        console.log("not mobile");
    } else {
        document.body.classList.add('is-mobile');
        console.log("is mobile");
        mobileUI = true;
    }
});

// Not sure why it's still here, but okay. 
const VIDYA_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_min","type":"uint256"},{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"distributePresale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_presaleAddr","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

let VIDYA, Inventory = null; 

let web3, accounts, connected = false;

window.addEventListener('load', async () => {
    if(window.ethereum) {
		init(); 
    }
});

async function init() {
    try {
        await ethereum.request({
            method: 'eth_requestAccounts'
        });

        await setup();

        // Subscribe to accounts change
        window.ethereum.on("accountsChanged", (accounts) => {
            setup();
        });

        // Subscribe to network change 
        window.ethereum.on('chainChanged', function(networkId) {
            setup();
        });
    } catch (e) {
        console.error(e)
    }
}

async function setup() {
    try {
        web3 = new Web3(window.ethereum); 
        accounts = await web3.eth.getAccounts(); 
		
        let chainID = await web3.eth.getChainId(); 
		
		if(chainID == 5) {
			$('.network-message').text('');  
			VidyaAddress = "0xFFE93E63E94da7A44739b6aBFA25B81CEd979a6b"; 
			inventoryContract = "0xfbCc08d711664Fe9514404e4d9597774Ae3A0a63"; 
		} else {
			$('.network-message').text('Connect wallet to Goerli network!'); 
			return; // Stops immediately if not Goerli 
		}
		
		Inventory = new web3.eth.Contract(inventoryABI, inventoryContract); 
		VIDYA = new web3.eth.Contract(VIDYA_ABI, VidyaAddress); 
		
		await tcg_base_init();

		$('#tcg_base, .agnosia-header-menu').css('opacity', '1');
		
		document.getElementById("playButton").style.display = "flex"; // Show play button 
		
		if(mobileUI) {
			$('.agnosia-mobile-menu, .fullscreenButton').css('display', 'flex'); 
			$(`.tcg_base_mobile_menu_option[data="profile"]`).attr('data-address', accounts[0]); 
		}
		
		// Load user address into profile link 
		$('.tcg_base_menu_profile_link').text(formatAddress(accounts[0]));
		$('.tcg_base_menu_profile_link').attr('data-address', accounts[0]);

		// Get the nonce for private key users 
		const privateKey = localStorage.getItem('privateKey');
		usePrivateKey = privateKey && privateKey.match(/^0x[0-9a-fA-F]{64}$/);

		if (usePrivateKey) {
			const fromAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
			currentNonce = await web3.eth.getTransactionCount(fromAddress, 'pending');
		}

		connected = true
    }
    
    catch(e) {
        console.error(e)
    }
    
}




function toggleFullScreen() {
    var elem = document.documentElement;

    if (!document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Currently not in full-screen, go full-screen
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        // Currently in full-screen, exit full-screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

$(document).on('click', '#fullscreenButton', function() {
    toggleFullScreen();
});

function handleOrientationChange() {
    var landscapePrompt = document.getElementById("landscapePrompt");
    
    if (window.innerWidth < window.innerHeight) {
        landscapePrompt.style.display = 'flex';
    } else {
        landscapePrompt.style.display = 'none';
    }
}

window.addEventListener("resize", handleOrientationChange);
document.addEventListener("DOMContentLoaded", handleOrientationChange);
