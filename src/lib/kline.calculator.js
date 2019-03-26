define(['charts'],function(){
    (function(global,factory){
        return global.klineIndicator = factory()
    })(window,function() {
        /**
         * 计算obv指标
         *
         * @method OBV
         * @param {Array} ticks
         * ticks为二维数组类型，其中内层数组第一个值为收盘价，第二个值为成交量
         * @return {Array} obvs
         */
        var obv = function (ticks) {
            var lastTick, obvs = [], length = ticks.length;
            for (var i = 0; i < length; i++) {
                var value = 0, curTick = ticks[i];
                if (i != 0) {
                    var lastObvValue = obvs[i-1];
                    if (curTick[0] >= lastTick[0]) {
                        value = lastObvValue + curTick[1];
                    } else {
                        value = lastObvValue - curTick[1];
                    }
                }
                obvs.push(value);
                lastTick = curTick;
            }
            return obvs;
        };

        var ema = function (lastEma, closePrice, units) {
            return (lastEma * (units - 1) + closePrice * 2) / (units + 1);
        };

        var dea = function (lastDea, curDiff) {
            return (lastDea * 8 + curDiff * 2) / 10;
        };

        /**
         *
         * 计算macd指标,快速和慢速移动平均线的周期分别取12和26
         *
         * @method MACD
         * @param {Array} ticks
         * 一维数组类型，每个元素为tick的收盘价格
         * @return {Object} 返回一个包含diffs deas bars属性的对象,每个属性对应的类型为{Array[Number]}
         */
        var macd = function (ticks) {
            var ema12 = [], ema26 = [], diffs = [], deas = [], bars = [];
            for(var i = 0; i < ticks.length; i++) {
                var c = ticks[i];
                if (i == 0) {
                    ema12.push(c);
                    ema26.push(c);
                    deas.push(0);
                } else {
                    ema12.push(ema(ema12[i-1], c, 12));
                    ema26.push(ema(ema26[i-1], c, 26));
                }
                diffs.push(ema12[i] - ema26[i]);
                if (i != 0) {
                    deas.push(dea(deas[i-1], diffs[i]));
                }
                bars.push((diffs[i]-deas[i]) * 2);
            }
            return {diffs: diffs, deas: deas, bars: bars};
        };

        var getMaxHighAndMinLow = function (ticks) {
            var maxHigh = ticks[0][0], minLow = ticks[0][1];
            for (var i = 0; i < ticks.length; i++) {
                var t = ticks[i], high = t[0], low = t[1];
                if (high > maxHigh) {
                    maxHigh = high;
                }
                if (low < minLow) {
                    minLow = low;
                }
            }
            return [maxHigh, minLow];
        };

        /**
         *
         * 计算kdj指标,rsv的周期为9日
         *
         * @method KDJ
         * @param {Array} ticks
         * 二维数组类型，其中内层数组包含三个元素值，第一个值表示当前Tick的最高价格，第二个表示当前Tick的最低价格，第三个表示当前Tick的收盘价格
         * @return {Object} 返回一个包含k d j属性的对象,每个属性对应的类型为{Array[Number]}
         */
        var kdj = function (ticks) {
            var nineDaysTicks = [], days = 9, rsvs = [];
            var ks = [], ds = [], js = [];
            var lastK, lastD, curK, curD;
            var maxAndMin, max, min;
            for (var i = 0; i < ticks.length; i++) {
                var t = ticks[i], close = t[2];
                nineDaysTicks.push(t);
                maxAndMin = getMaxHighAndMinLow(nineDaysTicks);
                max = maxAndMin[0];
                min = maxAndMin[1];
                if (max == min) {
                    rsvs.push(0);
                } else {
                    rsvs.push((close - min) / (max - min) * 100);
                }
                if (nineDaysTicks.length == days) {
                    nineDaysTicks.shift();
                }
                if (i == 0) {
                    lastK = lastD = rsvs[i];
                }
                curK = 2 / 3 * lastK + 1 / 3 * rsvs[i];
                ks.push(curK);
                lastK = curK;

                curD = 2 / 3 * lastD + 1 / 3 * curK;
                ds.push(curD);
                lastD = curD;

                js.push(3 * curK - 2 * curD);
            }
            return {"k": ks, "d": ds, "j": js};
        };

        /**
         *
         * 计算移动平均线指标, ma的周期为days
         *
         * @method MA
         * @param {Array} ticks
         * @param Number days
         * 一维数组类型，每个元素为当前Tick的收盘价格
         * @return {Array} mas
         */
        // var ma = function(ticks, days) {
        //     var maSum = 0, p = 0;
        //     var mas = [];
        //     for (var i = 0; i < ticks.length; i++) {
        //         maSum += ticks[i];
        //         ma = maSum / days;
        //         mas.push(ma);
        //     }
        //     return mas;
        // };

        var ma = function(ticks, dayCount) {
            var mas = [];
            for (var i = 0, len = ticks.length; i < len; i++) {
                if (i < dayCount) {
                    mas.push('-');
                    continue;
                }
                var sum = 0;
                for (var j = 0; j < dayCount; j++) {
                    sum += ticks[i - j];
                }
                mas.push((sum / dayCount).toFixed(2));
            }
            return mas;
        };

        /**
         *
         * 计算boll指标,ma的周期为20日
         *
         * @method BOLL
         * @param {Array} ticks
         * 一维数组类型，每个元素为当前Tick的收盘价格
         * @return {Object} 返回一个包含upper mid lower属性的对象,每个属性对应的类型为{Array[Number]}
         */
        var boll = function(ticks) {
            //移动平均线周期为20
            var maDays = 20, tickBegin = maDays - 1, maSum = 0, p = 0;
            var ups = [], mas = [], lows = [];
            for (var i = 0; i < ticks.length; i ++) {
                var c = ticks[i], ma, md, bstart, mdSum;
                maSum += c;
                if (i >= tickBegin) {
                    maSum = maSum - p;
                    ma = maSum / maDays;
                    mas.push(ma);
                    bstart = i - tickBegin;
                    p = ticks[bstart];
                    mdSum = ticks.slice(bstart, bstart+maDays).reduce(function(a, b) {return a + Math.pow(b-ma, 2);}, 0);
                    md = Math.sqrt(mdSum/maDays);
                    ups.push(ma + 2 * md);
                    lows.push(ma - 2 * md);
                } else {
                    //ugly constant, just keep the same type for client
                    ups.push(-1);
                    mas.push(-1);
                    lows.push(-1);
                }
            }
            return {"upper": ups, "mid": mas, "lower": lows};
        };

        /**
         *
         * 计算rsi指标,分别返回以6日，12日，24日为参考基期的RSI值
         *
         * @method RSI
         * @param {Array} ticks
         * 一维数组类型，每个元素为当前Tick的收盘价格
         * @return {Object} 返回一个包含rsi6 rsi12 rsi24属性的对象,每个属性对应的类型为{Array[Number]}
         */
        var rsi = function(ticks) {
            var lastClosePx = ticks[0];
            var days = [6, 12, 24], result = {};
            for (var i = 0 ; i < ticks.length; i ++) {
                var c = ticks[i];
                var m = Math.max(c-lastClosePx, 0), a = Math.abs(c-lastClosePx);
                for (var di = 0; di < days.length; di++) {
                    var d = days[di];
                    if (!result.hasOwnProperty("rsi"+d)) {
                        result["lastSm"+d] = result["lastSa"+d]  = 0;
                        result["rsi"+d] = [0];
                    } else {
                        result["lastSm"+d] = (m + (d - 1) * result["lastSm"+d]) / d;
                        result["lastSa"+d] = (a + (d - 1) * result["lastSa"+d]) / d;
                        if (result["lastSa"+d] != 0) {
                            result["rsi"+d].push(result["lastSm"+d] / result["lastSa"+d] * 100);
                        } else {
                            result["rsi"+d].push(0);
                        }
                    }
                }
                lastClosePx = c;
            }
            return {"rsi6": result["rsi6"], "rsi12": result["rsi12"], "rsi24": result["rsi24"]};
        };
        return {"OBV": obv, "MACD": macd, "KDJ": kdj, "BOLL": boll, "RSI": rsi, "MA": ma};
    })
});
