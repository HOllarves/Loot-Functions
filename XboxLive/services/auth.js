/**
 * Xbox Live Auth service
 */
const Auth = () => {

  const xboxAuth = require('@xboxreplay/xboxlive-auth')
  const adminEmail = process.env.XBOX_LIVE_ADMIN_EMAIL
  const adminPass = process.env.XBOX_LIVE_ADMIN_PASS

  /**
   * Authenticate user with
   * xbox live credentials
   * @returns {Object} User Auth Object
   */
  const authenticate = async () => {
    try {
      return xboxAuth.authenticate(adminEmail, adminPass)
    } catch (e) {
      return { success: false, message: 'Unable to authenticate user', error: e }
    }
  }

  return {
    authenticate,
  }

}

module.exports = Auth()
