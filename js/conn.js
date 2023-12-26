let mobileUI = false; 

$(window).on('load', function() {
    $('.agnosia-loading').remove(); 
});

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

const VIDYA_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_min","type":"uint256"},{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"distributePresale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_presaleAddr","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]; 

let VIDYA; 
let Inventory; 

window.addEventListener('load', async () => {
    if(window.ethereum) {
		init(); 
    }
}); 

var web3, accounts, connected = false; 

async function init() {
    try {
		
		await ethereum.request({method: 'eth_requestAccounts'}); 
		
        await setup(); 
            
		// Subscribe to accounts change
		window.ethereum.on("accountsChanged", (accounts) => {
			setup(); 
		}); 
			
		// Subscribe to network change 
		window.ethereum.on('chainChanged', function(networkId) {
			setup(); 
		});
		
    }
	
    catch(e) {
        console.error(e)
    }
}

async function setup() {
    try {
        web3 = new Web3(window.ethereum); 
        accounts = await web3.eth.getAccounts(); 
		
        let chainID = await web3.eth.getChainId(); 
		
		if(chainID == 5) {
			console.log("Connected to Goerli testnet!"); 
			VidyaAddress = "0xFFE93E63E94da7A44739b6aBFA25B81CEd979a6b"; 
			inventoryContract = "0xfbCc08d711664Fe9514404e4d9597774Ae3A0a63"; 
		}
		
		Inventory = new web3.eth.Contract(inventoryABI, inventoryContract); 
		VIDYA = new web3.eth.Contract(VIDYA_ABI, VidyaAddress); 
		
		await tcg_base_init();
		await tcg_base_startPlaylist(); 
		
		$('.agnosia-header-info').remove(); 
		$('#tcg_base, .agnosia-header-menu').css('opacity', '1');
		
		if(mobileUI) {
			$('.agnosia-mobile-menu, .fullscreenButton').css('display', 'flex'); 
			$(`.tcg_base_mobile_menu_option[data="profile"]`).attr('data-address', accounts[0]); 
		}
		
		// Load user address into profile link 
		$('.tcg_base_menu_profile_link').text(formatAddress(accounts[0]));
		$('.tcg_base_menu_profile_link').attr('data-address', accounts[0]);

		connected = true
    }
    
    catch(e) {
        console.error(e)
    }
    
}




function goFullScreen() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function exitFullScreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // Only exit if currently in fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

document.getElementById("fullscreenButton").addEventListener("click", function() {
    goFullScreen();
});

function handleOrientationChange() {
    if (window.innerHeight < window.innerWidth && mobileUI) {
        // Display the fullscreen button in landscape
        document.getElementById("fullscreenButton").style.display = 'flex';
    } else {
        // Hide the fullscreen button in portrait and exit fullscreen
        document.getElementById("fullscreenButton").style.display = 'none';
        exitFullScreen();
    }
}

window.addEventListener("resize", handleOrientationChange);
handleOrientationChange();
