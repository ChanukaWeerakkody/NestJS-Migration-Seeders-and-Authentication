const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis-10273.c92.us-east-1-3.ec2.cloud.redislabs.com',
  port: 10273,
  password: 'kLAx13DA4XisIlFUauM3xfsIhSBKt20Y',
});

async function verifyKey() {
  try {
    console.log('Connecting to Redis Cloud...');
    const keys = await redis.keys('*');
    console.log('ALL keys found in Redis:', keys);
    
    if (keys.length > 0) {
      const value = await redis.get(keys[0]);
      console.log(`Value for ${keys[0]}:`, value);
    } else {
        console.log("No 'user:*' keys found.");
    }

  } catch (err) {
    console.error('Redis Error:', err);
  } finally {
    redis.disconnect();
  }
}

verifyKey();
