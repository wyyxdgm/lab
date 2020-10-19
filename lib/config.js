const DIR = {L: 'L', R: 'R', T: 'T', B: 'B'};
const CSS_TYPE = {
  'CSS': 'css',
  'LESS': 'less',
  'SCSS': 'scss',
}
const DOM_TO_CSS_TYPE = CSS_TYPE.CSS;//  配置类型
// ImageModel
const SIMILAR_VALUE = 4;
const POSITIVE_NOT_MATCH_COUNT = 8;
const NAGTIVE_MATCH_COUNT = 5;
const LINE_MOST_MATCH_COUNT = 3;

// Shape
const AROUND_RADIUS = 10;
const SHAPE_SIZE = 50;

module.exports = {
  DIR,
  SIMILAR_VALUE,
  POSITIVE_NOT_MATCH_COUNT,
  NAGTIVE_MATCH_COUNT,
  LINE_MOST_MATCH_COUNT,
  AROUND_RADIUS,
  SHAPE_SIZE,
  DOM_TO_CSS_TYPE,
}