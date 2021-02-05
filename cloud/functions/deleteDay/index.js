const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const zoneTable = db.collection('zone');
  const { zoneId, dayId } = event;
  const { openId } = event.userInfo;
  console.log('event', event);

  if (typeof dayId !== 'string'
    || !dayId
    || typeof zoneId !== 'string'
    || !zoneId
  ) {
    return { code: 4000 };
  }

  try {
    const { stats: { updated } } = await zoneTable.where({
      _id: _.eq(zoneId),
      hostOpenId: _.eq(openId),
    }).update({
      data: {
        days: _.pull({
          _id: _.eq(dayId)
        }),
        updateTime: new Date(),
      }
    });
    if (updated !== 1) {
      throw new Error('更新失败');
    }
    return { code: 2000 };
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}