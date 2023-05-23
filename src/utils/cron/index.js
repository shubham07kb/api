async function cron(req, res, src, env) {
    //start code
    stime = src.getDate(0).inFixedString;
    stimeStr = stime.year + stime.month + stime.date + stime.hour + stime.minute + stime.second + stime.millisecond;
    if (env.crondb == 'y') {
        await src.db.insertOne(JSON.parse(env.crondbvar), JSON.parse(env.crondbvar).prefix + 'record', { start_time: stimeStr });
    }
    fromua = await src.fetch('https://stack.cyclic.app/api/meta/getMeta').then((r) => { return r.json() });
    //code
    dbarray = { "WebCMS": "dbvar" };
    dbWorkings = [];
    dbNotWorkings = [];
    for (let key in dbarray) {
        p = await src.db.query(JSON.parse(env[dbarray[key]]), JSON.parse(env[dbarray[key]]).prefix + 'cron', { for: "status" });
        if (p.length==1 && p[0].dbname == key) {
            dbWorkings.push(key);
        } else { 
            dbNotWorkings.push(key);
        }
    }
    //end code
    etime = src.getDate(0).inFixedString;
    etimeStr = etime.year + etime.month + etime.date + etime.hour + etime.minute + etime.second + etime.millisecond;
    res.header('Content-Type', 'application/json');
    resp = { status: 'success', status_code: 1, status_message: 'Cron Job Done', status_message_code: '634', status_message_code_message: 'Cron_Job_Done', start_time: stimeStr, end_time: etimeStr, fromIP: src.getIP(req), user_agent: fromua, notes: { dbWorkings: dbWorkings, dbNotWorkings: dbNotWorkings } };
    if (env.crondb == 'y') {
        await src.db.update(JSON.parse(env.crondbvar), JSON.parse(env.crondbvar).prefix + 'record', { start_time: stimeStr }, { $set: { end_time: etimeStr, fromIP: src.getIP(req), user_agent: fromua, notes: resp.notes } });
    }
    res.send(resp);
}
//30 0-23/1 * * *
//0 * * * *
//2023 05 14 23 30 21 30
//yyyy mm dd hh mm ss ms
module.exports = {
    cron: cron
}