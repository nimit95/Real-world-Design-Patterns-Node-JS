const fs = require('fs');
const nPath = require('path');

/* Path Constants */
const DOCS_FILE = './docs.md';

const sections = [
  {
    name: 'Creational', 
    topics: [
      { name: 'abstractFactory', path: './Creational' },
      { name: 'builder', path: './Creational'  },
      { name: 'factoryMethod', path: './Creational'  },
      { name: 'prototype', path: './Creational'  },
      { name: 'singleton', path: './Creational'  }
    ]
  },
  {
    name: 'Structural', 
    topics: [
      { name: 'adapter', path: './Structural' },
      { name: 'bridge', path: './Structural' },
      { name: 'composite', path: './Structural' },
      { name: 'decorator', path: './Structural' },
      { name: 'facade', path: './Structural' },
      { name: 'flyweight', path: './Structural' },
      { name: 'proxy', path: './Structural' },
    ]
  },
  {
    name: 'Behavioral', 
    topics: [
      { name: 'chainOfResponsibility', path: './Behavioral' },
      { name: 'command', path: './Behavioral' },
      { name: 'iterator', path: './Behavioral' },
    ]
  }
];

/* Utility functions  */
const stripPunctuation = (str) =>
  str.replace(/["'.,/#!$%^&*;:’{}=_`~()]/g, '');

const reverseCamelCase = (str) => {
  return str.replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) { return str.toUpperCase(); });
};
const dashCase = (str) => {
  return stripPunctuation(str).replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) { return str.toLowerCase(); }).toLowerCase().split(' ')
    .filter((word) => word !== '').join('-');
};

/* Writing Markdown */
const writeHeader = (sections) =>
  `# Real World Design Patterns using NodeJs APIs

${sections.map(writeSectionContents).join('')}
`;

const writeSectionContents = ({ name, topics }) =>
  `**[${reverseCamelCase(name)}](#${dashCase(name)})**
${topics.map(writeTopicContents).join('')}
`;

const writeTopicContents = ({ name }) => `* [${reverseCamelCase(name)}](#${dashCase(name)})
`;

const writeSection = ({ name, topics }) =>
  `## ${name}
${topics.map(writeTopic).join('')}
`;

const writeTopic = ({ name, path }) =>
  `### ${reverseCamelCase(name)}
${[`${path}/${name}.js`].map(writeFile).join('')}
`;

const writeFile = (path) =>
  `##### ${nPath.basename(path)}
\`\`\`Javascript
${fs.readFileSync(path)}
\`\`\`
`;


const writeDocument = () =>
  `${writeHeader(sections)}
${sections.map(writeSection).join('')}
`;

fs.writeFileSync(DOCS_FILE, writeDocument());

