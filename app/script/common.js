function fill0(number) {
    return number < 10 ? `0${number}` : number;
}

export default {
    getFormattedDate(date) {
        return `${date.getFullYear()}-${fill0(date.getMonth() + 1)}-${fill0(date.getDate())}`;
    },
    clearObject(object) {
        for (const key in object) {
            if (typeof object[key] === 'string' || typeof object[key] === 'number') {
                object[key] = '';
            } else if (typeof object[key] === 'object') {
                if (object[key] instanceof Array) {
                    object[key] = [];
                } else {
                    this.clearObject(object[key]);
                }
            }
        }
    },
    priceCN(n) {
        console.log(n);
        const fraction = ['角', '分'];
        const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        const unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟'],
        ];
        const head = n < 0 ? '欠' : '';

        n = Math.abs(n);

        let s = '';

        for (let i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);

        for (let i = 0; i < unit[0].length && n > 0; i++) {
            let p = '';
            for (let j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    },
    copyObject(from) {
        const to = {};
        for (const prop in from) {
            to[prop] = from[prop];
        }
        return to;
    },
};
