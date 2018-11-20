module.exports = function(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ExportNamedDeclaration)
    .replaceWith(p => {
      console.log(p.value.declaration.type);
      let { declaration } = p.value;
      if (declaration.type === "FunctionDeclaration") {
        let expr = j.expressionStatement(
          j.assignmentExpression(
            "=",
            j.memberExpression(
              j.memberExpression(j.identifier("module"), j.identifier("exports")),
              j.identifier(p.value.declaration.id.name)
            ),
            j.identifier(p.value.declaration.id.name)
          )
        );
        return [p.value.declaration, expr];
      }
      if (declaration.type === "VariableDeclaration") {
        console.log(declaration);
        let decs = [];
        for (let dec of declaration.declarations) {
          decs.push(
            j.expressionStatement(
              j.assignmentExpression(
                "=",
                j.memberExpression(
                  j.memberExpression(j.identifier("module"), j.identifier("exports")),
                  j.identifier(dec.id.name)
                ),
                j.identifier(dec.id.name)
              )
            )
          );
        }
        return [p.value.declaration, ...decs];
      }
      // TODO: Handle default exports
      return p.value;
    })
    .toSource();
};
