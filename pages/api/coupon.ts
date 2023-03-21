import { ethers, utils } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    tokenId: string,
    sig: string
}

export default function handler( 
    req: NextApiRequest,
    res: NextApiResponse) {
    if (req.method === 'POST') {
        const signerAddress = ethers.utils.verifyMessage(req.body.message, req.body.sig)
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
