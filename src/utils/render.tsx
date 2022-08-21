import * as fs from "fs";
import prettier from "prettier";
import ReactDOMServer from "react-dom/server";

export const render = async (Element: (p: any) => JSX.Element, getStaticProps: () => any, path: string) => {
  const props = await getStaticProps();
  const html = ReactDOMServer.renderToStaticMarkup(<Element {...props} />);
  const htmlWDoc = "<!DOCTYPE html>" + html;
  const prettyHtml = prettier.format(htmlWDoc, { parser: "html" });
  const outputFile = `./output/${path}.html`;
  fs.writeFileSync(outputFile, prettyHtml);
  console.log(`Wrote ${outputFile}`);
};
