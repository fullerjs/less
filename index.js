'use strict';
const less = require('less');

module.exports = function(f, mat, options, next) {
  mat.getContent(content => {
    less.render(content.toString(), {
      paths: [ mat.src.dirname ],
      compress: !options.compress
    }, (err, output) => {
      if (err) {
        next({
          message: err.message,
          file: err.filename === 'input' ? mat.dst().path : err.filename,
          line: err.line,
          column: err.column,
          extract: err.extract.join('\n')
        });
      } else {
        f.addDependencies(output.imports, mat.id);
        next(null, mat.setContent(output.css));
      }
    });
  });
};
