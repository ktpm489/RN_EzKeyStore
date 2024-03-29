import { POSTAPI } from '../../helper/utils'
import CONSTANTS from '../../helper/constants';
import { Utils } from '../../helper/utils'
import { validatePassword, getPrivateKey, } from '../../services/auth.service';
import CryptoJS from 'crypto-js';
import Language from '../../i18n/i18n'

export let code: string;

export async function getBackupCode(password: string, pk_en: string, addressWL) {
    if (! await validatePassword(password)) {
        throw (Language.t('Send.AlerError.Content'))
    }

    code = Utils.generateRandom(32)
    let pk = await getPrivateKey(password, pk_en)

    let body = {
        md5Hash: CryptoJS.MD5(code).toString(CryptoJS.enc.Hex),
        walletAddress: addressWL,
        privateKeyEncrypted: CryptoJS.AES.encrypt(pk, code).toString()
    }

    return new Promise((resolve, reject) => {
        POSTAPI(CONSTANTS.WALLET_API + '/api/backup', body)
            .then(response => {
                resolve(code)
            })
            .catch((err: Response) => {
                if (err.status == 200) {
                    reject(null);
                } else {
                    reject('Something wrongs. Do you want to try again?')
                }
            })
    })

}