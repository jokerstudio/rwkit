import { ethers, utils } from 'ethers'

export default function handler(req, res) {
    if (req.method === 'POST') {
        const signerAddress = ethers.utils.verifyMessage(req.body.tokenId, req.body.sig)
        if (signerAddress == req.body.address) {
            res.status(200).json(signerAddress)
        }
        else 
        {
            res.status(401).json("Unauthorize")
        }
    } else {
        // Handle any other HTTP method
    }
}
