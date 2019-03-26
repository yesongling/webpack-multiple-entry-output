define(['charts','kLine.calculator'],function(){
    (function(global,factory){
        return global.klineConfig = factory()
    })(window,function(){

      // 将symbolInfo对象作为输入参数，并创建要发送到CryptoCompare的订阅字符串
      function createChannelString(symbolInfo) {
        var channel = symbolInfo.name.split(/[:/]/);
        const exchange = channel[0] === 'GDAX' ? 'Coinbase' : channel[0];
        const to = channel[2];
        const from = channel[1];
        // 订阅指定交易所和交易对的CryptoCompare交易频道
        return '0~${exchange}~${from}~${to}';
      }

      function subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback){
        var channelString = createChannelString(symbolInfo);

      }
    });

    return window
});
