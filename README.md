# poc-ethereum-platform
Research &amp; development towards an platform based on smart contracts

Alright, a story will follow regarding the platform website. Note: the site is Dutch for demonstration reasons.

The first time a user will open the platform Forus website, the user will not have any accounts. It can add its account by pressing the "Account toevoegen" button. This will pop up a QR code the user can scan with its Identity app. The site will now listen for a Whisper message with a Whisper public key added in the QR. A Whisper private key is not the same as an Ethereum private key and will be generated each time the user opens the website. This is not a cookie or added as user data, but remains in the Javascript memory of the site. 

![home-no-login](https://user-images.githubusercontent.com/3370256/48054673-1bb1db00-e1ae-11e8-9de2-f30a416b0115.png)

The use of Whisper is needed so that the identity application can communicate with the web interface. In this case, the identity application will tell the display name and Ethereum public key of the identity. These are then added to the website cookie storage and will be used as a form of web session.

The name of the currently active identity is visible at the top right of the screen. In case of the following screenshots, these will be named identical to the role the user has (Sponsor, Requester or Supplier), but in the real world, this could be "Martijn" as a person, or for example "QNH" for a organisational identity.

So first the sponsor. The sponsor can click the "Ik wil sponsor worden" button. This will load a page in which the user can create a token. Note that any user can become a sponsor this way. This will deploy an ERC20 contract to the Ethereum network. 

![create-token](https://user-images.githubusercontent.com/3370256/48054776-5156c400-e1ae-11e8-9c32-0dbd09a72447.png)

When the user presses "Aanmaken", a QR code popup will appear again. This contains a transaction the user has to sign and send via its identity application. Once again, the QR code will contain a Whisper private key which can be used in the identity app to show that the transaction is sent or done. 
Note that because the website has no private key of the user, as this will remain locked in the identity application, the private key is never revealed and cannot be 'stolen' in this way. 

![transaction-qr](https://user-images.githubusercontent.com/3370256/48056451-1eaeca80-e1b2-11e8-9c28-5225a6e8f6e7.png)

After the transaction is done, the voucher will now be available in the website. 

![new-token-in-overview](https://user-images.githubusercontent.com/3370256/48055265-7a2b8900-e1af-11e8-983b-b19fbf73297a.png)

However, the token is not yet active. While not active, the sponsor can add required claims (ERC735) to the token (not yet implemented). 

![new-token-page](https://user-images.githubusercontent.com/3370256/48055313-9a5b4800-e1af-11e8-8ac7-d861c254f01f.png)

When the validation rules are added, the sponsor can activate the token, allowing requesters to request the token and allowing the sponsor to add suppliers to the token. 

When active, users that are not the sponsor or a supplier to the token can request the token. 

![request-token](https://user-images.githubusercontent.com/3370256/48055484-ffaf3900-e1af-11e8-97db-7034df8c6889.png)

After a user has requested a token and meets the specified claims, the user has been granted the amount of tokens as stated in the creation of the token (the "Hoeveel krijgt een aanvrager" field in the "Ik wil sponsor worden" page)

On the homepage, every token is listed with a QR-icon on the left of each token. When this icon is clicked, a QR-popup will appear, containing the information the identity application needs to track the token, thus allowing the user to see its balance. The addess of the sponsor is also added, as a requester will not be the owner of the token, but instead follows the "allowance" methods of the ERC20 contract to be able to spend it. *More on this can be found at the bottom of this comment.

After the user added the token to its identity application, it is able to spend the token at the applied and approved suppliers. As a supplier, you can apply to be supplier of a token on the token overview page. By pressing the "Aanmelden" button, the want-to-be supplier can sign and send a transaction via QR-code, which in turn triggers an event in the ERC20 contract of the token, allowing it to be visible in the list of "Leveranciersaanvragen" (not yet implemented)

![token-page](https://user-images.githubusercontent.com/3370256/48056247-a7793680-e1b1-11e8-9d82-39eb324f9301.png)

The sponsor can see this list, and can decide to add the applied suppliers address to the list of approved suppliers. The requesters can spend their allowed tokens at that supplier now and further actions are done via the users identity application.

* Note on ERC20 ownership of the tokens. The sponsor of the token will generally remain the owner of the token, allowing the sponsor to take back any remaining tokens a user has when the token expires. This is done, by using the allowance methods of an ERC20. This states that, rather than having the requester transfer X tokens to any identity, the sponsor allows the requester to spend X tokens of the sponsor. In the contracts deployed via the platform site, the owner of a token (sponsor) can transfer the tokens freely, but allowed tokens (of the requesters) can only be transferred to a set list of addresses. 
