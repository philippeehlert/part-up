/* !
 * Autolinker.js
 * 1.4.4
 *
 * Copyright(c) 2017 Gregory Jacobs <greg@greg-jacobs.com>
 * MIT License
 *
 * https://github.com/gregjacobs/Autolinker.js
 */
!(function(e, t) {
  'function' == typeof define && define.amd
    ? define([], t)
    : 'object' == typeof exports
      ? (module.exports = t())
      : (e.Autolinker = t());
})(this, function() {
  var e = function(t) {
    (t = t || {}),
    (this.version = e.version),
    (this.urls = this.normalizeUrlsCfg(t.urls)),
    (this.email = 'boolean' != typeof t.email || t.email),
    (this.phone = 'boolean' != typeof t.phone || t.phone),
    (this.hashtag = t.hashtag || !1),
    (this.mention = t.mention || !1),
    (this.newWindow = 'boolean' != typeof t.newWindow || t.newWindow),
    (this.stripPrefix = this.normalizeStripPrefixCfg(t.stripPrefix)),
    (this.stripTrailingSlash =
        'boolean' != typeof t.stripTrailingSlash || t.stripTrailingSlash);
    let r = this.mention;
    if (r !== !1 && 'twitter' !== r && 'instagram' !== r) {
      throw new Error('invalid `mention` cfg - see docs');
    }
    let n = this.hashtag;
    if (n !== !1 && 'twitter' !== n && 'facebook' !== n && 'instagram' !== n) {
      throw new Error('invalid `hashtag` cfg - see docs');
    }
    (this.truncate = this.normalizeTruncateCfg(t.truncate)),
    (this.className = t.className || ''),
    (this.replaceFn = t.replaceFn || null),
    (this.context = t.context || this),
    (this.htmlParser = null),
    (this.matchers = null),
    (this.tagBuilder = null);
  };
  return (
    (e.link = function(t, r) {
      let n = new e(r);
      return n.link(t);
    }),
    (e.parse = function(t, r) {
      let n = new e(r);
      return n.parse(t);
    }),
    (e.version = '1.4.4'),
    (e.prototype = {
      constructor: e,
      normalizeUrlsCfg: function(e) {
        return (
          null == e && (e = !0),
          'boolean' == typeof e
            ? { schemeMatches: e, wwwMatches: e, tldMatches: e }
            : {
              schemeMatches:
                  'boolean' != typeof e.schemeMatches || e.schemeMatches,
              wwwMatches: 'boolean' != typeof e.wwwMatches || e.wwwMatches,
              tldMatches: 'boolean' != typeof e.tldMatches || e.tldMatches,
            }
        );
      },
      normalizeStripPrefixCfg: function(e) {
        return (
          null == e && (e = !0),
          'boolean' == typeof e
            ? { scheme: e, www: e }
            : {
              scheme: 'boolean' != typeof e.scheme || e.scheme,
              www: 'boolean' != typeof e.www || e.www,
            }
        );
      },
      normalizeTruncateCfg: function(t) {
        return 'number' == typeof t
          ? { length: t, location: 'end' }
          : e.Util.defaults(t || {}, {
            length: Number.POSITIVE_INFINITY,
            location: 'end',
          });
      },
      parse: function(e) {
        for (
          var t = this.getHtmlParser(),
            r = t.parse(e),
            n = 0,
            a = [],
            i = 0,
            s = r.length;
          i < s;
          i++
        ) {
          let o = r[i],
            c = o.getType();
          if ('element' === c && 'a' === o.getTagName()) {
            o.isClosing() ? (n = Math.max(n - 1, 0)) : n++;
          } else if ('text' === c && 0 === n) {
            let h = this.parseText(o.getText(), o.getOffset());
            a.push(...h);
          }
        }
        return (
          (a = this.compactMatches(a)), (a = this.removeUnwantedMatches(a))
        );
      },
      compactMatches: function(e) {
        e.sort(function(e, t) {
          return e.getOffset() - t.getOffset();
        });
        for (let t = 0; t < e.length - 1; t++) {
          let r = e[t],
            n = r.getOffset(),
            a = r.getMatchedText().length,
            i = n + a;
          if (t + 1 < e.length) {
            if (e[t + 1].getOffset() === n) {
              let s = e[t + 1].getMatchedText().length > a ? t : t + 1;
              e.splice(s, 1);
              continue;
            }
            e[t + 1].getOffset() <= i && e.splice(t + 1, 1);
          }
        }
        return e;
      },
      removeUnwantedMatches: function(t) {
        let r = e.Util.remove;
        return (
          this.hashtag ||
            r(t, function(e) {
              return 'hashtag' === e.getType();
            }),
          this.email ||
            r(t, function(e) {
              return 'email' === e.getType();
            }),
          this.phone ||
            r(t, function(e) {
              return 'phone' === e.getType();
            }),
          this.mention ||
            r(t, function(e) {
              return 'mention' === e.getType();
            }),
          this.urls.schemeMatches ||
            r(t, function(e) {
              return 'url' === e.getType() && 'scheme' === e.getUrlMatchType();
            }),
          this.urls.wwwMatches ||
            r(t, function(e) {
              return 'url' === e.getType() && 'www' === e.getUrlMatchType();
            }),
          this.urls.tldMatches ||
            r(t, function(e) {
              return 'url' === e.getType() && 'tld' === e.getUrlMatchType();
            }),
          t
        );
      },
      parseText: function(e, t) {
        t = t || 0;
        for (
          var r = this.getMatchers(), n = [], a = 0, i = r.length;
          a < i;
          a++
        ) {
          for (var s = r[a].parseMatches(e), o = 0, c = s.length; o < c; o++) {
            s[o].setOffset(t + s[o].getOffset());
          }
          n.push(...s);
        }
        return n;
      },
      link: function(e) {
        if (!e) return '';
        for (
          var t = this.parse(e), r = [], n = 0, a = 0, i = t.length;
          a < i;
          a++
        ) {
          let s = t[a];
          r.push(e.substring(n, s.getOffset())),
          r.push(this.createMatchReturnVal(s)),
          (n = s.getOffset() + s.getMatchedText().length);
        }
        return r.push(e.substring(n)), r.join('');
      },
      createMatchReturnVal: function(t) {
        let r;
        if (
          (this.replaceFn && (r = this.replaceFn.call(this.context, t)),
            'string' == typeof r)
        ) {
          return r;
        }
        if (r === !1) return t.getMatchedText();
        if (r instanceof e.HtmlTag) return r.toAnchorString();
        let n = t.buildTag();
        return n.toAnchorString();
      },
      getHtmlParser: function() {
        let t = this.htmlParser;
        return t || (t = this.htmlParser = new e.htmlParser.HtmlParser()), t;
      },
      getMatchers: function() {
        if (this.matchers) return this.matchers;
        let t = e.matcher,
          r = this.getTagBuilder(),
          n = [
            new t.Hashtag({
              tagBuilder: r,
              serviceName: this.hashtag,
            }),
            new t.Email({ tagBuilder: r }),
            new t.Phone({ tagBuilder: r }),
            new t.Mention({
              tagBuilder: r,
              serviceName: this.mention,
            }),
            new t.Url({
              tagBuilder: r,
              stripPrefix: this.stripPrefix,
              stripTrailingSlash: this.stripTrailingSlash,
            }),
          ];
        return (this.matchers = n);
      },
      getTagBuilder: function() {
        let t = this.tagBuilder;
        return (
          t ||
            (t = this.tagBuilder = new e.AnchorTagBuilder({
              newWindow: this.newWindow,
              truncate: this.truncate,
              className: this.className,
            })),
          t
        );
      },
    }),
    (e.match = {}),
    (e.matcher = {}),
    (e.htmlParser = {}),
    (e.truncate = {}),
    (e.Util = {
      abstractMethod: function() {
        throw 'abstract';
      },
      trimRegex: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
      assign: function(e, t) {
        for (let r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
        return e;
      },
      defaults: function(e, t) {
        for (let r in t) {
          t.hasOwnProperty(r) && void 0 === e[r] && (e[r] = t[r]);
        }
        return e;
      },
      extend: function(t, r) {
        let n = t.prototype,
          a = function() {};
        a.prototype = n;
        let i;
        i = r.hasOwnProperty('constructor')
          ? r.constructor
          : function() {
            n.constructor.apply(this, arguments);
          };
        let s = (i.prototype = new a());
        return (
          (s.constructor = i),
          (s.superclass = n),
          delete r.constructor,
          e.Util.assign(s, r),
          i
        );
      },
      ellipsis: function(e, t, r) {
        let n;
        return (
          e.length > t &&
            (null == r ? ((r = '&hellip;'), (n = 3)) : (n = r.length),
              (e = e.substring(0, t - n) + r)),
          e
        );
      },
      indexOf: function(e, t) {
        if (Array.prototype.indexOf) return e.indexOf(t);
        for (let r = 0, n = e.length; r < n; r++) {
          if (e[r] === t) return r;
        }
        return -1;
      },
      remove: function(e, t) {
        for (let r = e.length - 1; r >= 0; r--) {
          t(e[r]) === !0 && e.splice(r, 1);
        }
      },
      splitAndCapture: function(e, t) {
        for (var r, n = [], a = 0; (r = t.exec(e)); ) {
          n.push(e.substring(a, r.index)),
          n.push(r[0]),
          (a = r.index + r[0].length);
        }
        return n.push(e.substring(a)), n;
      },
      trim: function(e) {
        return e.replace(this.trimRegex, '');
      },
    }),
    (e.HtmlTag = e.Util.extend(Object, {
      whitespaceRegex: /\s+/,
      constructor: function(t) {
        e.Util.assign(this, t),
        (this.innerHtml = this.innerHtml || this.innerHTML);
      },
      setTagName: function(e) {
        return (this.tagName = e), this;
      },
      getTagName: function() {
        return this.tagName || '';
      },
      setAttr: function(e, t) {
        let r = this.getAttrs();
        return (r[e] = t), this;
      },
      getAttr: function(e) {
        return this.getAttrs()[e];
      },
      setAttrs: function(t) {
        let r = this.getAttrs();
        return e.Util.assign(r, t), this;
      },
      getAttrs: function() {
        return this.attrs || (this.attrs = {});
      },
      setClass: function(e) {
        return this.setAttr('class', e);
      },
      addClass: function(t) {
        for (
          var r,
            n = this.getClass(),
            a = this.whitespaceRegex,
            i = e.Util.indexOf,
            s = n ? n.split(a) : [],
            o = t.split(a);
          (r = o.shift());

        ) {
          i(s, r) === -1 && s.push(r);
        }
        return (this.getAttrs()['class'] = s.join(' ')), this;
      },
      removeClass: function(t) {
        for (
          var r,
            n = this.getClass(),
            a = this.whitespaceRegex,
            i = e.Util.indexOf,
            s = n ? n.split(a) : [],
            o = t.split(a);
          s.length && (r = o.shift());

        ) {
          let c = i(s, r);
          c !== -1 && s.splice(c, 1);
        }
        return (this.getAttrs()['class'] = s.join(' ')), this;
      },
      getClass: function() {
        return this.getAttrs()['class'] || '';
      },
      hasClass: function(e) {
        return (' ' + this.getClass() + ' ').indexOf(' ' + e + ' ') !== -1;
      },
      setInnerHtml: function(e) {
        return (this.innerHtml = e), this;
      },
      getInnerHtml: function() {
        return this.innerHtml || '';
      },
      toAnchorString: function() {
        let e = this.getTagName(),
          t = this.buildAttrsStr();
        return (
          (t = t ? ' ' + t : ''),
          ['<', e, t, '>', this.getInnerHtml(), '</', e, '>'].join('')
        );
      },
      buildAttrsStr: function() {
        if (!this.attrs) return '';
        let e = this.getAttrs(),
          t = [];
        for (let r in e) {
          e.hasOwnProperty(r) && t.push(r + '="' + e[r] + '"');
        }
        return t.join(' ');
      },
    })),
    (e.RegexLib = (function() {
      let e =
          'A-Za-z\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢴऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛱ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿕ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋ-ꞭꞰ-ꞷꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭥꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ',
        t =
          '0-9٠-٩۰-۹߀-߉०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯෦-෯๐-๙໐-໙༠-༩၀-၉႐-႙០-៩᠐-᠙᥆-᥏᧐-᧙᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙꘠-꘩꣐-꣙꤀-꤉꧐-꧙꧰-꧹꩐-꩙꯰-꯹０-９',
        r = e + t,
        n = new RegExp('(?:[' + t + ']{1,3}\\.){3}[' + t + ']{1,3}'),
        a = '[' + r + '](?:[' + r + '\\-]*[' + r + '])?',
        i = new RegExp(
          '(?:(?:(?:' + a + '\\.)*(?:' + a + '))|(?:' + n.source + '))'
        );
      return {
        alphaNumericCharsStr: r,
        alphaCharsStr: e,
        domainNameRegex: i,
      };
    })()),
    (e.AnchorTagBuilder = e.Util.extend(Object, {
      constructor: function(e) {
        (e = e || {}),
        (this.newWindow = e.newWindow),
        (this.truncate = e.truncate),
        (this.className = e.className);
      },
      build: function(t) {
        return new e.HtmlTag({
          tagName: 'a',
          attrs: this.createAttrs(t),
          innerHtml: this.processAnchorText(t.getAnchorText()),
        });
      },
      createAttrs: function(e) {
        let t = { href: e.getAnchorHref() },
          r = this.createCssClass(e);
        return (
          r && (t['class'] = r),
          this.newWindow &&
            ((t.target = '_blank'), (t.rel = 'noopener noreferrer')),
          this.truncate &&
            this.truncate.length &&
            this.truncate.length < e.getAnchorText().length &&
            (t.title = e.getAnchorHref()),
          t
        );
      },
      createCssClass: function(e) {
        let t = this.className;
        if (t) {
          for (
            var r = [t], n = e.getCssClassSuffixes(), a = 0, i = n.length;
            a < i;
            a++
          ) {
            r.push(t + '-' + n[a]);
          }
          return r.join(' ');
        }
        return '';
      },
      processAnchorText: function(e) {
        return (e = this.doTruncate(e));
      },
      doTruncate: function(t) {
        let r = this.truncate;
        if (!r || !r.length) return t;
        let n = r.length,
          a = r.location;
        return 'smart' === a
          ? e.truncate.TruncateSmart(t, n)
          : 'middle' === a
            ? e.truncate.TruncateMiddle(t, n)
            : e.truncate.TruncateEnd(t, n);
      },
    })),
    (e.htmlParser.HtmlParser = e.Util.extend(Object, {
      htmlRegex: (function() {
        let e = /!--([\s\S]+?)--/,
          t = /[0-9a-zA-Z][0-9a-zA-Z:]*/,
          r = /[^\s"'>\/=\x00-\x1F\x7F]+/,
          n = /(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/,
          a = r.source + '(?:\\s*=\\s*' + n.source + ')?';
        return new RegExp(
          [
            '(?:',
            '<(!DOCTYPE)',
            '(?:',
            '\\s+',
            '(?:',
            a,
            '|',
            n.source + ')',
            ')*',
            '>',
            ')',
            '|',
            '(?:',
            '<(/)?',
            '(?:',
            e.source,
            '|',
            '(?:',
            '(' + t.source + ')',
            '\\s*/?',
            ')',
            '|',
            '(?:',
            '(' + t.source + ')',
            '\\s+',
            '(?:',
            '(?:\\s+|\\b)',
            a,
            ')*',
            '\\s*/?',
            ')',
            ')',
            '>',
            ')',
          ].join(''),
          'gi'
        );
      })(),
      htmlCharacterEntitiesRegex: /(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,
      parse: function(e) {
        for (
          var t, r, n = this.htmlRegex, a = 0, i = [];
          null !== (t = n.exec(e));

        ) {
          let s = t[0],
            o = t[3],
            c = t[1] || t[4] || t[5],
            h = !!t[2],
            l = t.index,
            u = e.substring(a, l);
          u && ((r = this.parseTextAndEntityNodes(a, u)), i.push(...r)),
          o
            ? i.push(this.createCommentNode(l, s, o))
            : i.push(this.createElementNode(l, s, c, h)),
          (a = l + s.length);
        }
        if (a < e.length) {
          let g = e.substring(a);
          g &&
            ((r = this.parseTextAndEntityNodes(a, g)),
              r.forEach(function(e) {
                i.push(e);
              }));
        }
        return i;
      },
      parseTextAndEntityNodes: function(t, r) {
        for (
          var n = [],
            a = e.Util.splitAndCapture(r, this.htmlCharacterEntitiesRegex),
            i = 0,
            s = a.length;
          i < s;
          i += 2
        ) {
          let o = a[i],
            c = a[i + 1];
          o && (n.push(this.createTextNode(t, o)), (t += o.length)),
          c && (n.push(this.createEntityNode(t, c)), (t += c.length));
        }
        return n;
      },
      createCommentNode: function(t, r, n) {
        return new e.htmlParser.CommentNode({
          offset: t,
          text: r,
          comment: e.Util.trim(n),
        });
      },
      createElementNode: function(t, r, n, a) {
        return new e.htmlParser.ElementNode({
          offset: t,
          text: r,
          tagName: n.toLowerCase(),
          closing: a,
        });
      },
      createEntityNode: function(t, r) {
        return new e.htmlParser.EntityNode({ offset: t, text: r });
      },
      createTextNode: function(t, r) {
        return new e.htmlParser.TextNode({ offset: t, text: r });
      },
    })),
    (e.htmlParser.HtmlNode = e.Util.extend(Object, {
      offset: void 0,
      text: void 0,
      constructor: function(t) {
        e.Util.assign(this, t);
      },
      getType: e.Util.abstractMethod,
      getOffset: function() {
        return this.offset;
      },
      getText: function() {
        return this.text;
      },
    })),
    (e.htmlParser.CommentNode = e.Util.extend(e.htmlParser.HtmlNode, {
      comment: '',
      getType: function() {
        return 'comment';
      },
      getComment: function() {
        return this.comment;
      },
    })),
    (e.htmlParser.ElementNode = e.Util.extend(e.htmlParser.HtmlNode, {
      tagName: '',
      closing: !1,
      getType: function() {
        return 'element';
      },
      getTagName: function() {
        return this.tagName;
      },
      isClosing: function() {
        return this.closing;
      },
    })),
    (e.htmlParser.EntityNode = e.Util.extend(e.htmlParser.HtmlNode, {
      getType: function() {
        return 'entity';
      },
    })),
    (e.htmlParser.TextNode = e.Util.extend(e.htmlParser.HtmlNode, {
      getType: function() {
        return 'text';
      },
    })),
    (e.match.Match = e.Util.extend(Object, {
      constructor: function(e) {
        (this.tagBuilder = e.tagBuilder),
        (this.matchedText = e.matchedText),
        (this.offset = e.offset);
      },
      getType: e.Util.abstractMethod,
      getMatchedText: function() {
        return this.matchedText;
      },
      setOffset: function(e) {
        this.offset = e;
      },
      getOffset: function() {
        return this.offset;
      },
      getAnchorHref: e.Util.abstractMethod,
      getAnchorText: e.Util.abstractMethod,
      getCssClassSuffixes: function() {
        return [this.getType()];
      },
      buildTag: function() {
        return this.tagBuilder.build(this);
      },
    })),
    (e.match.Email = e.Util.extend(e.match.Match, {
      constructor: function(t) {
        e.match.Match.prototype.constructor.call(this, t),
        (this.email = t.email);
      },
      getType: function() {
        return 'email';
      },
      getEmail: function() {
        return this.email;
      },
      getAnchorHref: function() {
        return 'mailto:' + this.email;
      },
      getAnchorText: function() {
        return this.email;
      },
    })),
    (e.match.Hashtag = e.Util.extend(e.match.Match, {
      constructor: function(t) {
        e.match.Match.prototype.constructor.call(this, t),
        (this.serviceName = t.serviceName),
        (this.hashtag = t.hashtag);
      },
      getType: function() {
        return 'hashtag';
      },
      getServiceName: function() {
        return this.serviceName;
      },
      getHashtag: function() {
        return this.hashtag;
      },
      getAnchorHref: function() {
        let e = this.serviceName,
          t = this.hashtag;
        switch (e) {
          case 'twitter':
            return 'https://twitter.com/hashtag/' + t;
          case 'facebook':
            return 'https://www.facebook.com/hashtag/' + t;
          case 'instagram':
            return 'https://instagram.com/explore/tags/' + t;
          default:
            throw new Error('Unknown service name to point hashtag to: ', e);
        }
      },
      getAnchorText: function() {
        return '#' + this.hashtag;
      },
    })),
    (e.match.Phone = e.Util.extend(e.match.Match, {
      constructor: function(t) {
        e.match.Match.prototype.constructor.call(this, t),
        (this.number = t.number),
        (this.plusSign = t.plusSign);
      },
      getType: function() {
        return 'phone';
      },
      getNumber: function() {
        return this.number;
      },
      getAnchorHref: function() {
        return 'tel:' + (this.plusSign ? '+' : '') + this.number;
      },
      getAnchorText: function() {
        return this.matchedText;
      },
    })),
    (e.match.Mention = e.Util.extend(e.match.Match, {
      constructor: function(t) {
        e.match.Match.prototype.constructor.call(this, t),
        (this.mention = t.mention),
        (this.serviceName = t.serviceName);
      },
      getType: function() {
        return 'mention';
      },
      getMention: function() {
        return this.mention;
      },
      getServiceName: function() {
        return this.serviceName;
      },
      getAnchorHref: function() {
        switch (this.serviceName) {
          case 'twitter':
            return 'https://twitter.com/' + this.mention;
          case 'instagram':
            return 'https://instagram.com/' + this.mention;
          default:
            throw new Error(
              'Unknown service name to point mention to: ',
              this.serviceName
            );
        }
      },
      getAnchorText: function() {
        return '@' + this.mention;
      },
      getCssClassSuffixes: function() {
        let t = e.match.Match.prototype.getCssClassSuffixes.call(this),
          r = this.getServiceName();
        return r && t.push(r), t;
      },
    })),
    (e.match.Url = e.Util.extend(e.match.Match, {
      constructor: function(t) {
        e.match.Match.prototype.constructor.call(this, t),
        (this.urlMatchType = t.urlMatchType),
        (this.url = t.url),
        (this.protocolUrlMatch = t.protocolUrlMatch),
        (this.protocolRelativeMatch = t.protocolRelativeMatch),
        (this.stripPrefix = t.stripPrefix),
        (this.stripTrailingSlash = t.stripTrailingSlash);
      },
      schemePrefixRegex: /^(https?:\/\/)?/i,
      wwwPrefixRegex: /^(https?:\/\/)?(www\.)?/i,
      protocolRelativeRegex: /^\/\//,
      protocolPrepended: !1,
      getType: function() {
        return 'url';
      },
      getUrlMatchType: function() {
        return this.urlMatchType;
      },
      getUrl: function() {
        let e = this.url;
        return (
          this.protocolRelativeMatch ||
            this.protocolUrlMatch ||
            this.protocolPrepended ||
            ((e = this.url = 'http://' + e), (this.protocolPrepended = !0)),
          e
        );
      },
      getAnchorHref: function() {
        let e = this.getUrl();
        return e.replace(/&amp;/g, '&');
      },
      getAnchorText: function() {
        let e = this.getMatchedText();
        return (
          this.protocolRelativeMatch &&
            (e = this.stripProtocolRelativePrefix(e)),
          this.stripPrefix.scheme && (e = this.stripSchemePrefix(e)),
          this.stripPrefix.www && (e = this.stripWwwPrefix(e)),
          this.stripTrailingSlash && (e = this.removeTrailingSlash(e)),
          e
        );
      },
      stripSchemePrefix: function(e) {
        return e.replace(this.schemePrefixRegex, '');
      },
      stripWwwPrefix: function(e) {
        return e.replace(this.wwwPrefixRegex, '$1');
      },
      stripProtocolRelativePrefix: function(e) {
        return e.replace(this.protocolRelativeRegex, '');
      },
      removeTrailingSlash: function(e) {
        return '/' === e.charAt(e.length - 1) && (e = e.slice(0, -1)), e;
      },
    })),
    (e.tldRegex = /(?:xn--vermgensberatung-pwb|xn--vermgensberater-ctb|xn--clchc0ea0b2g2a9gcd|xn--w4r85el8fhu5dnra|northwesternmutual|travelersinsurance|vermögensberatung|xn--3oq18vl8pn36a|xn--5su34j936bgsg|xn--bck1b9a5dre4c|xn--mgbai9azgqp6j|xn--mgberp4a5d4ar|xn--xkc2dl3a5ee0h|vermögensberater|xn--fzys8d69uvgm|xn--mgba7c0bbn0a|xn--xkc2al3hye2a|americanexpress|kerryproperties|sandvikcoromant|xn--i1b6b1a6a2e|xn--kcrx77d1x4a|xn--lgbbat1ad8j|xn--mgba3a4f16a|xn--mgbc0a9azcg|xn--nqv7fs00ema|afamilycompany|americanfamily|bananarepublic|cancerresearch|cookingchannel|kerrylogistics|weatherchannel|xn--54b7fta0cc|xn--6qq986b3xl|xn--80aqecdr1a|xn--b4w605ferd|xn--fiq228c5hs|xn--jlq61u9w7b|xn--mgba3a3ejt|xn--mgbaam7a8h|xn--mgbayh7gpa|xn--mgbb9fbpob|xn--mgbbh1a71e|xn--mgbca7dzdo|xn--mgbi4ecexp|xn--mgbx4cd0ab|international|lifeinsurance|orientexpress|spreadbetting|travelchannel|wolterskluwer|xn--eckvdtc9d|xn--fpcrj9c3d|xn--fzc2c9e2c|xn--tiq49xqyj|xn--yfro4i67o|xn--ygbi2ammx|construction|lplfinancial|pamperedchef|scholarships|versicherung|xn--3e0b707e|xn--80adxhks|xn--80asehdb|xn--8y0a063a|xn--gckr3f0f|xn--mgb9awbf|xn--mgbab2bd|xn--mgbpl2fh|xn--mgbt3dhd|xn--mk1bu44c|xn--ngbc5azd|xn--ngbe9e0a|xn--ogbpf8fl|xn--qcka1pmc|accountants|barclaycard|blackfriday|blockbuster|bridgestone|calvinklein|contractors|creditunion|engineering|enterprises|foodnetwork|investments|kerryhotels|lamborghini|motorcycles|olayangroup|photography|playstation|productions|progressive|redumbrella|rightathome|williamhill|xn--11b4c3d|xn--1ck2e1b|xn--1qqw23a|xn--3bst00m|xn--3ds443g|xn--42c2d9a|xn--45brj9c|xn--55qw42g|xn--6frz82g|xn--80ao21a|xn--9krt00a|xn--cck2b3b|xn--czr694b|xn--d1acj3b|xn--efvy88h|xn--estv75g|xn--fct429k|xn--fjq720a|xn--flw351e|xn--g2xx48c|xn--gecrj9c|xn--gk3at1e|xn--h2brj9c|xn--hxt814e|xn--imr513n|xn--j6w193g|xn--jvr189m|xn--kprw13d|xn--kpry57d|xn--kpu716f|xn--mgbtx2b|xn--mix891f|xn--nyqy26a|xn--pbt977c|xn--pgbs0dh|xn--q9jyb4c|xn--rhqv96g|xn--rovu88b|xn--s9brj9c|xn--ses554g|xn--t60b56a|xn--vuq861b|xn--w4rs40l|xn--xhq521b|xn--zfr164b|சிங்கப்பூர்|accountant|apartments|associates|basketball|bnpparibas|boehringer|capitalone|consulting|creditcard|cuisinella|eurovision|extraspace|foundation|healthcare|immobilien|industries|management|mitsubishi|nationwide|newholland|nextdirect|onyourside|properties|protection|prudential|realestate|republican|restaurant|schaeffler|swiftcover|tatamotors|technology|telefonica|university|vistaprint|vlaanderen|volkswagen|xn--30rr7y|xn--3pxu8k|xn--45q11c|xn--4gbrim|xn--55qx5d|xn--5tzm5g|xn--80aswg|xn--90a3ac|xn--9dbq2a|xn--9et52u|xn--c2br7g|xn--cg4bki|xn--czrs0t|xn--czru2d|xn--fiq64b|xn--fiqs8s|xn--fiqz9s|xn--io0a7i|xn--kput3i|xn--mxtq1m|xn--o3cw4h|xn--pssy2u|xn--unup4y|xn--wgbh1c|xn--wgbl6a|xn--y9a3aq|accenture|alfaromeo|allfinanz|amsterdam|analytics|aquarelle|barcelona|bloomberg|christmas|community|directory|education|equipment|fairwinds|financial|firestone|fresenius|frontdoor|fujixerox|furniture|goldpoint|goodhands|hisamitsu|homedepot|homegoods|homesense|honeywell|institute|insurance|kuokgroup|ladbrokes|lancaster|landrover|lifestyle|marketing|marshalls|mcdonalds|melbourne|microsoft|montblanc|panasonic|passagens|pramerica|richardli|scjohnson|shangrila|solutions|statebank|statefarm|stockholm|travelers|vacations|xn--90ais|xn--c1avg|xn--d1alf|xn--e1a4c|xn--fhbei|xn--j1aef|xn--j1amh|xn--l1acc|xn--nqv7f|xn--p1acf|xn--tckwe|xn--vhquv|yodobashi|abudhabi|airforce|allstate|attorney|barclays|barefoot|bargains|baseball|boutique|bradesco|broadway|brussels|budapest|builders|business|capetown|catering|catholic|chrysler|cipriani|cityeats|cleaning|clinique|clothing|commbank|computer|delivery|deloitte|democrat|diamonds|discount|discover|download|engineer|ericsson|esurance|everbank|exchange|feedback|fidelity|firmdale|football|frontier|goodyear|grainger|graphics|guardian|hdfcbank|helsinki|holdings|hospital|infiniti|ipiranga|istanbul|jpmorgan|lighting|lundbeck|marriott|maserati|mckinsey|memorial|mortgage|movistar|observer|partners|pharmacy|pictures|plumbing|property|redstone|reliance|saarland|samsclub|security|services|shopping|showtime|softbank|software|stcgroup|supplies|symantec|telecity|training|uconnect|vanguard|ventures|verisign|woodside|xn--90ae|xn--node|xn--p1ai|xn--qxam|yokohama|السعودية|abogado|academy|agakhan|alibaba|android|athleta|auction|audible|auspost|avianca|banamex|bauhaus|bentley|bestbuy|booking|brother|bugatti|capital|caravan|careers|cartier|channel|chintai|citadel|clubmed|college|cologne|comcast|company|compare|contact|cooking|corsica|country|coupons|courses|cricket|cruises|dentist|digital|domains|exposed|express|farmers|fashion|ferrari|ferrero|finance|fishing|fitness|flights|florist|flowers|forsale|frogans|fujitsu|gallery|genting|godaddy|guitars|hamburg|hangout|hitachi|holiday|hosting|hoteles|hotmail|hyundai|iselect|ismaili|jewelry|juniper|kitchen|komatsu|lacaixa|lancome|lanxess|lasalle|latrobe|leclerc|liaison|limited|lincoln|markets|metlife|monster|netbank|netflix|network|neustar|okinawa|oldnavy|organic|origins|panerai|philips|pioneer|politie|realtor|recipes|rentals|reviews|rexroth|samsung|sandvik|schmidt|schwarz|science|shiksha|shriram|singles|spiegel|staples|starhub|statoil|storage|support|surgery|systems|temasek|theater|theatre|tickets|tiffany|toshiba|trading|walmart|wanggou|watches|weather|website|wedding|whoswho|windows|winners|xfinity|yamaxun|youtube|zuerich|католик|الجزائر|العليان|پاکستان|كاثوليك|موبايلي|இந்தியா|abarth|abbott|abbvie|active|africa|agency|airbus|airtel|alipay|alsace|alstom|anquan|aramco|author|bayern|beauty|berlin|bharti|blanco|bostik|boston|broker|camera|career|caseih|casino|center|chanel|chrome|church|circle|claims|clinic|coffee|comsec|condos|coupon|credit|cruise|dating|datsun|dealer|degree|dental|design|direct|doctor|dunlop|dupont|durban|emerck|energy|estate|events|expert|family|flickr|futbol|gallup|garden|george|giving|global|google|gratis|health|hermes|hiphop|hockey|hughes|imamat|insure|intuit|jaguar|joburg|juegos|kaufen|kinder|kindle|kosher|lancia|latino|lawyer|lefrak|living|locker|london|luxury|madrid|maison|makeup|market|mattel|mobile|mobily|monash|mormon|moscow|museum|mutual|nagoya|natura|nissan|nissay|norton|nowruz|office|olayan|online|oracle|orange|otsuka|pfizer|photos|physio|piaget|pictet|quebec|racing|realty|reisen|repair|report|review|rocher|rogers|ryukyu|safety|sakura|sanofi|school|schule|secure|select|shouji|soccer|social|stream|studio|supply|suzuki|swatch|sydney|taipei|taobao|target|tattoo|tennis|tienda|tjmaxx|tkmaxx|toyota|travel|unicom|viajes|viking|villas|virgin|vision|voting|voyage|vuelos|walter|warman|webcam|xihuan|xperia|yachts|yandex|zappos|москва|онлайн|ابوظبي|ارامكو|الاردن|المغرب|امارات|فلسطين|مليسيا|இலங்கை|ファッション|actor|adult|aetna|amfam|amica|apple|archi|audio|autos|azure|baidu|beats|bible|bingo|black|boats|boots|bosch|build|canon|cards|chase|cheap|chloe|cisco|citic|click|cloud|coach|codes|crown|cymru|dabur|dance|deals|delta|dodge|drive|dubai|earth|edeka|email|epost|epson|faith|fedex|final|forex|forum|gallo|games|gifts|gives|glade|glass|globo|gmail|green|gripe|group|gucci|guide|homes|honda|horse|house|hyatt|ikano|intel|irish|iveco|jetzt|koeln|kyoto|lamer|lease|legal|lexus|lilly|linde|lipsy|lixil|loans|locus|lotte|lotto|lupin|macys|mango|media|miami|money|mopar|movie|nadex|nexus|nikon|ninja|nokia|nowtv|omega|osaka|paris|parts|party|phone|photo|pizza|place|poker|praxi|press|prime|promo|quest|radio|rehab|reise|ricoh|rocks|rodeo|salon|sener|seven|sharp|shell|shoes|skype|sling|smart|smile|solar|space|stada|store|study|style|sucks|swiss|tatar|tires|tirol|tmall|today|tokyo|tools|toray|total|tours|trade|trust|tunes|tushu|ubank|vegas|video|vista|vodka|volvo|wales|watch|weber|weibo|works|world|xerox|yahoo|zippo|ایران|بازار|بھارت|سودان|سورية|همراه|संगठन|বাংলা|భారత్|嘉里大酒店|aarp|able|adac|aero|aigo|akdn|ally|amex|army|arpa|arte|asda|asia|audi|auto|baby|band|bank|bbva|beer|best|bike|bing|blog|blue|bofa|bond|book|buzz|cafe|call|camp|care|cars|casa|case|cash|cbre|cern|chat|citi|city|club|cool|coop|cyou|data|date|dclk|deal|dell|desi|diet|dish|docs|doha|duck|duns|dvag|erni|fage|fail|fans|farm|fast|fiat|fido|film|fire|fish|flir|food|ford|free|fund|game|gbiz|gent|ggee|gift|gmbh|gold|golf|goog|guge|guru|hair|haus|hdfc|help|here|hgtv|host|hsbc|icbc|ieee|imdb|immo|info|itau|java|jeep|jobs|jprs|kddi|kiwi|kpmg|kred|land|lego|lgbt|lidl|life|like|limo|link|live|loan|loft|love|ltda|luxe|maif|meet|meme|menu|mini|mint|mobi|moda|moto|mtpc|name|navy|news|next|nico|nike|ollo|open|page|pars|pccw|pics|ping|pink|play|plus|pohl|porn|post|prod|prof|qpon|raid|read|reit|rent|rest|rich|rmit|room|rsvp|ruhr|safe|sale|sapo|sarl|save|saxo|scor|scot|seat|seek|sexy|shaw|shia|shop|show|silk|sina|site|skin|sncf|sohu|song|sony|spot|star|surf|talk|taxi|team|tech|teva|tiaa|tips|town|toys|tube|vana|visa|viva|vivo|vote|voto|wang|weir|wien|wiki|wine|work|xbox|yoga|zara|zero|zone|дети|сайт|بيتك|تونس|شبكة|عراق|عمان|موقع|भारत|ভারত|ਭਾਰਤ|ભારત|ලංකා|グーグル|クラウド|ポイント|大众汽车|组织机构|電訊盈科|香格里拉|aaa|abb|abc|aco|ads|aeg|afl|aig|anz|aol|app|art|aws|axa|bar|bbc|bbt|bcg|bcn|bet|bid|bio|biz|bms|bmw|bnl|bom|boo|bot|box|buy|bzh|cab|cal|cam|car|cat|cba|cbn|cbs|ceb|ceo|cfa|cfd|com|crs|csc|dad|day|dds|dev|dhl|diy|dnp|dog|dot|dtv|dvr|eat|eco|edu|esq|eus|fan|fit|fly|foo|fox|frl|ftr|fun|fyi|gal|gap|gdn|gea|gle|gmo|gmx|goo|gop|got|gov|hbo|hiv|hkt|hot|how|htc|ibm|ice|icu|ifm|ing|ink|int|ist|itv|iwc|jcb|jcp|jio|jlc|jll|jmp|jnj|jot|joy|kfh|kia|kim|kpn|krd|lat|law|lds|lol|lpl|ltd|man|mba|mcd|med|men|meo|mil|mit|mlb|mls|mma|moe|moi|mom|mov|msd|mtn|mtr|nab|nba|nec|net|new|nfl|ngo|nhk|now|nra|nrw|ntt|nyc|obi|off|one|ong|onl|ooo|org|ott|ovh|pay|pet|pid|pin|pnc|pro|pru|pub|pwc|qvc|red|ren|ril|rio|rip|run|rwe|sap|sas|sbi|sbs|sca|scb|ses|sew|sex|sfr|ski|sky|soy|srl|srt|stc|tab|tax|tci|tdk|tel|thd|tjx|top|trv|tui|tvs|ubs|uno|uol|ups|vet|vig|vin|vip|wed|win|wme|wow|wtc|wtf|xin|xxx|xyz|you|yun|zip|бел|ком|қаз|мкд|мон|орг|рус|срб|укр|հայ|קום|قطر|كوم|مصر|कॉम|नेट|คอม|ไทย|ストア|セール|みんな|中文网|天主教|我爱你|新加坡|淡马锡|诺基亚|飞利浦|ac|ad|ae|af|ag|ai|al|am|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|ελ|бг|ею|рф|გე|닷넷|닷컴|삼성|한국|コム|世界|中信|中国|中國|企业|佛山|信息|健康|八卦|公司|公益|台湾|台灣|商城|商店|商标|嘉里|在线|大拿|娱乐|家電|工行|广东|微博|慈善|手机|手表|政务|政府|新闻|时尚|書籍|机构|游戏|澳門|点看|珠宝|移动|网址|网店|网站|网络|联通|谷歌|购物|通販|集团|食品|餐厅|香港)/),
    (e.matcher.Matcher = e.Util.extend(Object, {
      constructor: function(e) {
        this.tagBuilder = e.tagBuilder;
      },
      parseMatches: e.Util.abstractMethod,
    })),
    (e.matcher.Email = e.Util.extend(e.matcher.Matcher, {
      matcherRegex: (function() {
        let t = e.RegexLib.alphaNumericCharsStr,
          r = '!#$%&\'*+\\-\\/=?^_`{|}~',
          n = '\\s"(),:;<>@\\[\\]',
          a = t + r,
          i = a + n,
          s = new RegExp(
            '(?:(?:[' +
              a +
              '](?![^@]*\\.\\.)(?:[' +
              a +
              '.]*[' +
              a +
              '])?)|(?:\\"[' +
              i +
              '.]+\\"))@'
          ),
          o = e.RegexLib.domainNameRegex,
          c = e.tldRegex;
        return new RegExp([s.source, o.source, '\\.', c.source].join(''), 'gi');
      })(),
      parseMatches: function(t) {
        for (
          var r, n = this.matcherRegex, a = this.tagBuilder, i = [];
          null !== (r = n.exec(t));

        ) {
          let s = r[0];
          i.push(
            new e.match.Email({
              tagBuilder: a,
              matchedText: s,
              offset: r.index,
              email: s,
            })
          );
        }
        return i;
      },
    })),
    (e.matcher.Hashtag = e.Util.extend(e.matcher.Matcher, {
      matcherRegex: new RegExp(
        '#[_' + e.RegexLib.alphaNumericCharsStr + ']{1,139}',
        'g'
      ),
      nonWordCharRegex: new RegExp(
        '[^' + e.RegexLib.alphaNumericCharsStr + ']'
      ),
      constructor: function(t) {
        e.matcher.Matcher.prototype.constructor.call(this, t),
        (this.serviceName = t.serviceName);
      },
      parseMatches: function(t) {
        for (
          var r,
            n = this.matcherRegex,
            a = this.nonWordCharRegex,
            i = this.serviceName,
            s = this.tagBuilder,
            o = [];
          null !== (r = n.exec(t));

        ) {
          let c = r.index,
            h = t.charAt(c - 1);
          if (0 === c || a.test(h)) {
            let l = r[0],
              u = r[0].slice(1);
            o.push(
              new e.match.Hashtag({
                tagBuilder: s,
                matchedText: l,
                offset: c,
                serviceName: i,
                hashtag: u,
              })
            );
          }
        }
        return o;
      },
    })),
    (e.matcher.Phone = e.Util.extend(e.matcher.Matcher, {
      matcherRegex: /(?:(\+)?\d{1,3}[-\040.]?)?\(?\d{3}\)?[-\040.]?\d{3}[-\040.]?\d{4}([,;]*[0-9]+#?)*/g,
      parseMatches: function(t) {
        for (
          var r, n = this.matcherRegex, a = this.tagBuilder, i = [];
          null !== (r = n.exec(t));

        ) {
          let s = r[0],
            o = s.replace(/[^0-9,;#]/g, ''),
            c = !!r[1];
          this.testMatch(r[2]) &&
            this.testMatch(s) &&
            i.push(
              new e.match.Phone({
                tagBuilder: a,
                matchedText: s,
                offset: r.index,
                number: o,
                plusSign: c,
              })
            );
        }
        return i;
      },
      testMatch: function(e) {
        return /\D/.test(e);
      },
    })),
    (e.matcher.Mention = e.Util.extend(e.matcher.Matcher, {
      matcherRegexes: {
        twitter: new RegExp(
          '@[_' + e.RegexLib.alphaNumericCharsStr + ']{1,20}',
          'g'
        ),
        instagram: new RegExp(
          '@[_.' + e.RegexLib.alphaNumericCharsStr + ']{1,50}',
          'g'
        ),
      },
      nonWordCharRegex: new RegExp(
        '[^' + e.RegexLib.alphaNumericCharsStr + ']'
      ),
      constructor: function(t) {
        e.matcher.Matcher.prototype.constructor.call(this, t),
        (this.serviceName = t.serviceName);
      },
      parseMatches: function(t) {
        let r,
          n = this.matcherRegexes[this.serviceName],
          a = this.nonWordCharRegex,
          i = this.serviceName,
          s = this.tagBuilder,
          o = [];
        if (!n) return o;
        for (; null !== (r = n.exec(t)); ) {
          let c = r.index,
            h = t.charAt(c - 1);
          if (0 === c || a.test(h)) {
            let l = r[0].replace(/\.+$/g, ''),
              u = l.slice(1);
            o.push(
              new e.match.Mention({
                tagBuilder: s,
                matchedText: l,
                offset: c,
                serviceName: i,
                mention: u,
              })
            );
          }
        }
        return o;
      },
    })),
    (e.matcher.Url = e.Util.extend(e.matcher.Matcher, {
      matcherRegex: (function() {
        let t = /(?:[A-Za-z][-.+A-Za-z0-9]*:(?![A-Za-z][-.+A-Za-z0-9]*:\/\/)(?!\d+\/?)(?:\/\/)?)/,
          r = /(?:www\.)/,
          n = e.RegexLib.domainNameRegex,
          a = e.tldRegex,
          i = e.RegexLib.alphaNumericCharsStr,
          s = new RegExp(
            '[/?#](?:[' +
              i +
              '\\-+&@#/%=~_()|\'$*\\[\\]?!:,.;✓]*[' +
              i +
              '\\-+&@#/%=~_()|\'$*\\[\\]✓])?'
          );
        return new RegExp(
          [
            '(?:',
            '(',
            t.source,
            n.source,
            ')',
            '|',
            '(',
            '(//)?',
            r.source,
            n.source,
            ')',
            '|',
            '(',
            '(//)?',
            n.source + '\\.',
            a.source,
            '(?![-' + i + '])',
            ')',
            ')',
            '(?::[0-9]+)?',
            '(?:' + s.source + ')?',
          ].join(''),
          'gi'
        );
      })(),
      wordCharRegExp: new RegExp('[' + e.RegexLib.alphaNumericCharsStr + ']'),
      openParensRe: /\(/g,
      closeParensRe: /\)/g,
      constructor: function(t) {
        e.matcher.Matcher.prototype.constructor.call(this, t),
        (this.stripPrefix = t.stripPrefix),
        (this.stripTrailingSlash = t.stripTrailingSlash);
      },
      parseMatches: function(t) {
        for (
          var r,
            n = this.matcherRegex,
            a = this.stripPrefix,
            i = this.stripTrailingSlash,
            s = this.tagBuilder,
            o = [];
          null !== (r = n.exec(t));

        ) {
          let c = r[0],
            h = r[1],
            l = r[2],
            u = r[3],
            g = r[5],
            m = r.index,
            f = u || g,
            p = t.charAt(m - 1);
          if (
            e.matcher.UrlMatchValidator.isValid(c, h) &&
            !(
              (m > 0 && '@' === p) ||
              (m > 0 && f && this.wordCharRegExp.test(p))
            )
          ) {
            if (
              (/\?$/.test(c) && (c = c.substr(0, c.length - 1)),
                this.matchHasUnbalancedClosingParen(c))
            ) {
              c = c.substr(0, c.length - 1);
            } else {
              let d = this.matchHasInvalidCharAfterTld(c, h);
              d > -1 && (c = c.substr(0, d));
            }
            let x = h ? 'scheme' : l ? 'www' : 'tld',
              b = !!h;
            o.push(
              new e.match.Url({
                tagBuilder: s,
                matchedText: c,
                offset: m,
                urlMatchType: x,
                url: c,
                protocolUrlMatch: b,
                protocolRelativeMatch: !!f,
                stripPrefix: a,
                stripTrailingSlash: i,
              })
            );
          }
        }
        return o;
      },
      matchHasUnbalancedClosingParen: function(e) {
        let t = e.charAt(e.length - 1);
        if (')' === t) {
          let r = e.match(this.openParensRe),
            n = e.match(this.closeParensRe),
            a = (r && r.length) || 0,
            i = (n && n.length) || 0;
          if (a < i) return !0;
        }
        return !1;
      },
      matchHasInvalidCharAfterTld: function(t, r) {
        if (!t) return -1;
        let n = 0;
        r && ((n = t.indexOf(':')), (t = t.slice(n)));
        let a = e.RegexLib.alphaNumericCharsStr,
          i = new RegExp(
            '^((.?//)?[-.' + a + ']*[-' + a + ']\\.[-' + a + ']+)'
          ),
          s = i.exec(t);
        return null === s
          ? -1
          : ((n += s[1].length),
            (t = t.slice(s[1].length)),
            /^[^-.A-Za-z0-9:\/?#]/.test(t) ? n : -1);
      },
    })),
    (e.matcher.UrlMatchValidator = {
      hasFullProtocolRegex: /^[A-Za-z][-.+A-Za-z0-9]*:\/\//,
      uriSchemeRegex: /^[A-Za-z][-.+A-Za-z0-9]*:/,
      hasWordCharAfterProtocolRegex: new RegExp(
        ':[^\\s]*?[' + e.RegexLib.alphaCharsStr + ']'
      ),
      ipRegex: /[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?\.[0-9][0-9]?[0-9]?(:[0-9]*)?\/?$/,
      isValid: function(e, t) {
        return !(
          (t && !this.isValidUriScheme(t)) ||
          this.urlMatchDoesNotHaveProtocolOrDot(e, t) ||
          (this.urlMatchDoesNotHaveAtLeastOneWordChar(e, t) &&
            !this.isValidIpAddress(e)) ||
          this.containsMultipleDots(e)
        );
      },
      isValidIpAddress: function(e) {
        let t = new RegExp(
            this.hasFullProtocolRegex.source + this.ipRegex.source
          ),
          r = e.match(t);
        return null !== r;
      },
      containsMultipleDots: function(e) {
        return e.indexOf('..') > -1;
      },
      isValidUriScheme: function(e) {
        let t = e.match(this.uriSchemeRegex)[0].toLowerCase();
        return 'javascript:' !== t && 'vbscript:' !== t;
      },
      urlMatchDoesNotHaveProtocolOrDot: function(e, t) {
        return !(
          !e ||
          (t && this.hasFullProtocolRegex.test(t)) ||
          e.indexOf('.') !== -1
        );
      },
      urlMatchDoesNotHaveAtLeastOneWordChar: function(e, t) {
        return !(!e || !t) && !this.hasWordCharAfterProtocolRegex.test(e);
      },
    }),
    (e.truncate.TruncateEnd = function(t, r, n) {
      return e.Util.ellipsis(t, r, n);
    }),
    (e.truncate.TruncateMiddle = function(e, t, r) {
      if (e.length <= t) return e;
      let n, a;
      null == r
        ? ((r = '&hellip;'), (n = 8), (a = 3))
        : ((n = r.length), (a = r.length));
      let i = t - a,
        s = '';
      return (
        i > 0 && (s = e.substr(-1 * Math.floor(i / 2))),
        (e.substr(0, Math.ceil(i / 2)) + r + s).substr(0, i + n)
      );
    }),
    (e.truncate.TruncateSmart = function(e, t, r) {
      let n, a;
      null == r
        ? ((r = '&hellip;'), (a = 3), (n = 8))
        : ((a = r.length), (n = r.length));
      let i = function(e) {
          let t = {},
            r = e,
            n = r.match(/^([a-z]+):\/\//i);
          return (
            n && ((t.scheme = n[1]), (r = r.substr(n[0].length))),
            (n = r.match(/^(.*?)(?=(\?|#|\/|$))/i)),
            n && ((t.host = n[1]), (r = r.substr(n[0].length))),
            (n = r.match(/^\/(.*?)(?=(\?|#|$))/i)),
            n && ((t.path = n[1]), (r = r.substr(n[0].length))),
            (n = r.match(/^\?(.*?)(?=(#|$))/i)),
            n && ((t.query = n[1]), (r = r.substr(n[0].length))),
            (n = r.match(/^#(.*?)$/i)),
            n && (t.fragment = n[1]),
            t
          );
        },
        s = function(e) {
          let t = '';
          return (
            e.scheme && e.host && (t += e.scheme + '://'),
            e.host && (t += e.host),
            e.path && (t += '/' + e.path),
            e.query && (t += '?' + e.query),
            e.fragment && (t += '#' + e.fragment),
            t
          );
        },
        o = function(e, t) {
          let n = t / 2,
            a = Math.ceil(n),
            i = -1 * Math.floor(n),
            s = '';
          return i < 0 && (s = e.substr(i)), e.substr(0, a) + r + s;
        };
      if (e.length <= t) return e;
      let c = t - a,
        h = i(e);
      if (h.query) {
        let l = h.query.match(/^(.*?)(?=(\?|\#))(.*?)$/i);
        l && ((h.query = h.query.substr(0, l[1].length)), (e = s(h)));
      }
      if (e.length <= t) return e;
      if (
        (h.host && ((h.host = h.host.replace(/^www\./, '')), (e = s(h))),
          e.length <= t)
      ) {
        return e;
      }
      let u = '';
      if ((h.host && (u += h.host), u.length >= c)) {
        return h.host.length == t
          ? (h.host.substr(0, t - a) + r).substr(0, c + n)
          : o(u, c).substr(0, c + n);
      }
      let g = '';
      if ((h.path && (g += '/' + h.path), h.query && (g += '?' + h.query), g)) {
        if ((u + g).length >= c) {
          if ((u + g).length == t) return (u + g).substr(0, t);
          let m = c - u.length;
          return (u + o(g, m)).substr(0, c + n);
        }
        u += g;
      }
      if (h.fragment) {
        let f = '#' + h.fragment;
        if ((u + f).length >= c) {
          if ((u + f).length == t) return (u + f).substr(0, t);
          let p = c - u.length;
          return (u + o(f, p)).substr(0, c + n);
        }
        u += f;
      }
      if (h.scheme && h.host) {
        let d = h.scheme + '://';
        if ((u + d).length < c) return (d + u).substr(0, t);
      }
      if (u.length <= t) return u;
      let x = '';
      return (
        c > 0 && (x = u.substr(-1 * Math.floor(c / 2))),
        (u.substr(0, Math.ceil(c / 2)) + r + x).substr(0, c + n)
      );
    }),
    e
  );
});
