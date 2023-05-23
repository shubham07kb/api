async function getAccount(a, env, res) {
    re = {}
    try {
        if (a.accinfo == undefined || a.accData == undefined || a.accAuth == undefined || a.accinfo == '' || a.accData == '' || a.accAuth == '') {
            accSet = 0;
        } else {
            accSet = 1;
        }
        if (accSet == 1) {
            accData = src.jwt.verify(a.accinfo + '.' + a.accData + '.' + a.accAuth, env.jwtKey);
            re.status = 'passed';
            re.status_code = 1;
            re.status_message = 'Account Valid Token';
            re.status_message_code = '616';
            re.status_message_code_message = 'Account_Valid_Token';
            re.userData = accData;
        } else if (accSet == 0) {
            re.status = 'failed';
            re.status_code = 0;
            re.status_message = 'Unlogged Account';
            re.status_message_code = '614';
            re.status_message_code_message = 'Unlogged_Account';
        }
        return re;
    } catch (e) {
        if (e.message == 'invalid token') {
            re.status = 'failed';
            re.status_code = 0;
            re.status_message = 'Account Invalid Token';
            re.status_message_code = '615';
            re.status_message_code_message = 'Account_Invalid_Token';
        } else {
            re.status = 'failed';
            re.status_code = 0;
            re.status_message = 'Unlogged Account';
            re.status_message_code = '614';
            re.status_message_code_message = 'Unlogged_Account';
        }
        return re;
    }
}
module.exports = {
    getAccount: getAccount
}