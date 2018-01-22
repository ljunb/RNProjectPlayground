module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "react",
    "react-native",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    // see http://eslint.cn/docs/rules/
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-alert": "off",
    // 不限制箭头函数体使用大括号，但是参数必须用括号包裹（arrow-parens）
    "arrow-body-style": "off",
    // 开启时，单参数不加括号
    "arrow-parens": "off",
    // 关闭限制不同操作符
    "no-mixed-operators": "off",
    // 非空文件末尾不强制保留一行空行
    "eol-last": "off",
    // 去掉块声明间距的限制
    "padded-blocks": "off",
    // 不禁止使用 ++ 和 --
    "no-plusplus": "off",
    // 按需添加基数 parseInt('071', 8)
    "radix": ["error", "as-needed"],

    "no-lonely-if": "off",

    "no-restricted-syntax": "off",
    // 不强制驼峰
    "camelcase": "off",

    "quote-props": "off",
    // 箭头函数支持返回赋值，如ref={r => this.xx = r}
    "no-return-assign": "off",

    "react/require-default-props": "off",
    // 无状态函数组件允许不定义props类型
    "react/prop-types": "off",

    "no-unused-expressions": ["error", { "allowShortCircuit": true }],

    "global-require": "off",
    // 允许函数声明不按顺序
    "react/sort-comp": "off",
    // alert
    "no-undef": "off",
    "no-bitwise": "off",
    "no-param-reassign": "off",
    // 花括号空格
    "object-curly-spacing": "off",
    "guard-for-in": "off",
    "max-len": ["error", 120],
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
  }
};
// see more detail https://github.com/Kennytian/learning-react-native/blob/master/environment/react-native-eslint.md
