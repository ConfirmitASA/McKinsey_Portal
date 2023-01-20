import PptxGenJS from 'pptxgenjs';
import GlobalState from '../GlobalState';
import {api, apiError} from '../utils/api-request';
import {testData} from '../testdata';
import {objectOfObjectsToArrayOfObjects} from '../utils/commonUtils';

const USE_TEST_DATA = true;

function importAll(r) {
  const images = {};
  // eslint-disable-next-line array-callback-return
  r.keys().map(item => {
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

let imagesOHI = [];

export default function downloadPowerPoint() {
  const parameters = {
    ProjectId: GlobalState.activeProject.ProjectId,
  };

  const errorFunction = () => {
    document.querySelector('#download-report-button').classList.remove('hidden');
    document.querySelector('#download-report-loader').classList.add('hidden');
    apiError();
  };

  api('GetResponseData', parameters, getResponseDataSuccess, errorFunction);
}

function getResponseDataSuccess(o) {
  let responseData = o.Data;

  // for development
  if (USE_TEST_DATA) {
    responseData = testData;
  }

  switch (GlobalState.activeProject.ProductId) {
    case '1': // OHI
      if (imagesOHI.length === 0) {
        imagesOHI = importAll(
          require.context('../assets/images/pptImagesOHI', false, /\.(png|jpe?g|svg)$/)
        );
      }
      downloadPowerPointOHI(responseData);
      break;

    case '3': // Weekly Pulse
      downloadPowerPointWeeklyAttitudePulse(responseData);
      break;

    default:
      break;
  }
}

const COLORS = {
  topDecileStart: 'FFD700',
  topDecileStop: '002960',
  topQuartile: '002960',
  secondQuartile: '128FA7',
  thirdQuartile: '9FB9BD',
  bottomQuartile: 'D9D9D9',
};

const outcomesOrdered = [
  'Direction',
  'Leadership',
  'Work Environment',
  'Accountability',
  'Coordination & Control',
  'Capabilities',
  'Motivation',
  'Innovation & Learning',
  'External Orientation',
];

const MARGIN_LEFT = 0.61;

const subHeaderOptions = {
  x: MARGIN_LEFT,
  y: 0.91,
  w: 12,
  h: 0.42,
  color: '000000',
  align: 'left',
  valign: 'middle',
  margin: 0,
  fontFace: 'Arial',
  fontSize: 16,
};
const sourceTextOptions = {
  x: MARGIN_LEFT,
  y: 7.05,
  w: 10,
  h: 0.2,
  color: '000000',
  align: 'left',
  valign: 'middle',
  margin: 0,
  fontSize: 10,
};

function getColorBasedOnRank(rank) {
  const result = {
    mainColor: '000000',
    additionalColor: '000000',
    fontColor: 'FFFFFF',
  };
  switch (rank) {
    case '1D':
      result.mainColor = COLORS.topDecileStop;
      result.additionalColor = COLORS.topDecileStart;
      result.fontColor = 'FFFFFF';
      break;
    case '1Q':
      result.mainColor = COLORS.topQuartile;
      result.additionalColor = COLORS.topQuartile;
      result.fontColor = 'FFFFFF';
      break;
    case '2Q':
      result.mainColor = COLORS.secondQuartile;
      result.additionalColor = COLORS.secondQuartile;
      result.fontColor = 'FFFFFF';
      break;
    case '3Q':
      result.mainColor = COLORS.thirdQuartile;
      result.additionalColor = COLORS.thirdQuartile;
      result.fontColor = '000000';
      break;
    case '4Q':
      result.mainColor = COLORS.bottomQuartile;
      result.additionalColor = COLORS.bottomQuartile;
      result.fontColor = '000000';
      break;
    default:
      break;
  }

  return result;
}

function addSlide0(pptx) {
  const slide = pptx.addSlide({
    masterName: 'Master1',
    sectionTitle: 'Cover Page',
  });

  slide.addText(GlobalState.activeProject.DisplayName, {
    x: MARGIN_LEFT,
    y: 2.24,
    w: 5.46,
    h: 2.1,
    color: '051C2C',
    align: pptx.AlignH.left,
    valign: 'bottom',
    fontFace: 'Georgia',
    fontSize: 44,
    bold: true,
    margin: 0,
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const now = new Date();
  slide.addText(`${monthNames[now.getMonth()]} ${now.getFullYear()}`, {
    color: '000000',
    x: MARGIN_LEFT,
    y: 4.43,
    h: 0.33,
    w: 6.82,
    fontSize: 14,
    fontFace: 'Arial',
    align: pptx.AlignH.left,
    valign: 'top',
    margin: 0,
  });
  slide.addText(
    `CONFIDENTIAL AND PROPRIETARY\nAny use of this material without specific permission of McKinsey & Company is strictly prohibited`,
    {
      color: '000000',
      x: 0.64,
      y: 6.72,
      h: 0.46,
      w: 3.81,
      fontSize: 8,
      fontFace: 'Arial',
      align: pptx.AlignH.left,
      valign: 'top',
      margin: 0,
    }
  );
}

function addSlideScorecard(pptx, data) {
  const slide = pptx.addSlide({
    masterName: 'TITLE_ONLY',
    sectionTitle: 'Health Statistics and Scorecard',
  });
  slide.addText(`${GlobalState.activeProject.DisplayName} scorecard`, {
    placeholder: 'header',
  });
  slide.addText(
    `Source: ${GlobalState.activeProject.DisplayName} (n=${testData.OVERALL.N}); Benchmark: Global (n=2887626, no. surveys=809)`,
    sourceTextOptions
  );
  slide.addText(`OHI Score`, {
    x: MARGIN_LEFT,
    y: 1.5,
    w: 12,
    h: 0.28,
    color: '000000',
    align: 'left',
    valign: 'middle',
    margin: 0,
    fontFace: 'Arial',
    fontSize: 14,
    bold: true,
  });
  addBenchmarkLegend(slide);
  addOHIScoreShape(
    slide,
    {x: MARGIN_LEFT, y: 1.89, w: 1.21, h: 1.21},
    data.OVERALL.OHI.Rank,
    data.OVERALL.OHI.Score
  );
  slide.addText(`Outcomes & Practices`, {
    x: MARGIN_LEFT,
    y: 3.25,
    w: 12,
    h: 0.28,
    color: '000000',
    align: 'left',
    valign: 'middle',
    margin: 0,
    fontFace: 'Arial',
    fontSize: 14,
    bold: true,
  });
  const bestRecipe = objectOfObjectsToArrayOfObjects(data.OVERALL.Recipes).reduce((prev, current) =>
    prev.Alignment > current.Alignment ? prev : current
  );
  addRecipeAlignmentBlock(slide, {x: 9.32, y: 1.7}, bestRecipe);
  let positionX = MARGIN_LEFT;
  let positionY = 3.64;
  const sizes = {
    practiceTileHeight: 0.2,
    practiceTileWidth: 2.65,
    practiceTileMargin: 0.04,
    outcomeTileWidth: 1.25,
  };

  outcomesOrdered.forEach((outcomeName, index) => {
    const outcome = data.OVERALL.Outcomes[outcomeName];
    outcome.Id = outcomeName;
    if (index !== 0 && index % 3 === 0) {
      positionX += 4.11;
      positionY = 3.64;
    }
    addOutcomeBlock(slide, {x: positionX, y: positionY}, sizes, outcome);
    positionY +=
      (sizes.practiceTileHeight + sizes.practiceTileMargin) *
        Object.keys(outcome.Practices).length +
      0.05;
  });
}

function generateTablePractice(section) {
  var arrTabRows = [];

  //Row zero
  arrTabRows.push([
    {
      text: 'Outcomes',
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: 0,
        bold: true,
      },
      constCol: true,
    },
    {
      text: 'Practice',
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: 0,
        bold: true,
      },
      constCol: true,
    },
    {
      text: 'ACME',
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: 0,
        colspan: 2,
        bold: true,
      },
      constCol: true,
    },
  ]);

  var colNames = [];
  for (const element in section) {
    colNames.push(section[element].Label);
  }

  //N row
  arrTabRows.push([
    {
      text: '',
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: 0,
        fill: 'd8d8d8',
        border: [
          {type: 'solid', pt: 1, color: 'd8d8d8'},
          {type: 'solid', pt: 1, color: 'd8d8d8'},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'd8d8d8'},
        ],
      },
      constCol: true,
    },
    {
      text: 'N',
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'left',
        margin: 0,
        fill: 'd8d8d8',
        border: [
          {type: 'solid', pt: 1, color: 'd8d8d8'},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'd8d8d8'},
        ],
      },
      constCol: true,
    },
    {
      text: testData.OVERALL.N,
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: 0,
        fill: 'd8d8d8',
        colspan: 2,
        border: [
          {type: 'solid', pt: 1, color: 'd8d8d8'},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'ffffff'},
        ],
      },
      constCol: true,
    },
  ]);

  for (var i = 0; i < colNames.length; i++) {
    arrTabRows[0].push({
      text: colNames[i],
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        colspan: 2,
        margin: 0,
        bold: true,
      },
    });
    for (const subsection in section) {
      if (section[subsection].Label == colNames[i]) {
        arrTabRows[1].push({
          text: section[subsection].N,
          options: {
            fontFace: 'Arial',
            fontSize: 7,
            valign: 'middle',
            align: 'center',
            colspan: 2,
            margin: 0,
            fill: 'd8d8d8',
            border: [
              {type: 'solid', pt: 1, color: 'd8d8d8'},
              {type: 'solid', pt: 1, color: 'ffffff'},
              {type: 'solid', pt: 1, color: 'ffffff'},
              {type: 'solid', pt: 1, color: 'ffffff'},
            ],
          },
        });
      }
    }
  }

  //Outcomes names & first row in each outcome
  for (const outcomeName in testData.OVERALL.Outcomes) {
    let outcome = JSON.parse(JSON.stringify(testData.OVERALL.Outcomes[outcomeName]));

    var outcomeArr = [];

    var practiceNames = Object.keys(outcome.Practices);

    var colors = getColorBasedOnRank(outcome.Practices[practiceNames[0]].Rank);

    outcomeArr[0] = [
      {
        text: outcomeName,
        options: {
          fontFace: 'Arial',
          fontSize: 7,
          valign: 'middle',
          align: 'left',
          margin: [0, 0.1, 0, 0.1],
          rowspan: practiceNames.length,
          border: {type: 'solid', pt: 1, color: 'd8d8d8'},
        },
        constCol: true,
      },
      {
        text: practiceNames[0],
        options: {
          fontFace: 'Arial',
          fontSize: 7,
          valign: 'middle',
          align: 'left',
          margin: [0, 0.1, 0, 0.1],
          border: {type: 'solid', pt: 1, color: 'd8d8d8'},
        },
        constCol: true,
      },
      {
        text: '',
        options: {
          fontFace: 'Arial',
          fontSize: 7,
          fill: colors.additionalColor,
          margin: 0,
          valign: 'middle',
          border: [
            {type: 'solid', pt: 1, color: 'ffffff'},
            {type: 'solid', pt: 0, color: colors.mainColor},
            {type: 'solid', pt: 1, color: 'ffffff'},
            {type: 'solid', pt: 1, color: 'ffffff'},
          ],
        },
        constCol: true,
      },
      {
        text: outcome.Practices[practiceNames[0]].Score,
        options: {
          color: colors.fontColor,
          fill: colors.mainColor,
          fontFace: 'Arial',
          fontSize: 7,
          valign: 'middle',
          align: 'center',
          margin: [0, 0.12, 0, 0],
        },
        constCol: true,
      },
    ];

    for (const subsection in section) {
      var colors = getColorBasedOnRank(
        section[subsection].Outcomes[outcomeName].Practices[practiceNames[0]].Rank
      );
      outcomeArr[0].push(
        {
          text: '',
          options: {
            fontFace: 'Arial',
            fontSize: 7,
            fill: colors.additionalColor,
            margin: 0,
            valign: 'middle',
            border: [
              {type: 'solid', pt: 1, color: 'ffffff'},
              {type: 'solid', pt: 0, color: colors.mainColor},
              {type: 'solid', pt: 1, color: 'ffffff'},
              {type: 'solid', pt: 1, color: 'ffffff'},
            ],
          },
        },
        {
          text: section[subsection].Outcomes[outcomeName].Practices[practiceNames[0]].Score,
          options: {
            fontFace: 'Arial',
            fontSize: 7,
            valign: 'middle',
            align: 'center',
            margin: [0, 0.12, 0, 0],
            color: colors.fontColor,
            fill: colors.mainColor,
          },
        }
      );
    }

    //Rest of the rows in each outcome

    delete outcome.Practices[practiceNames[0]];
    practiceNames.shift();

    for (const practice in outcome.Practices) {
      var colors = getColorBasedOnRank(outcome.Practices[practice].Rank);
      outcomeArr.push([
        {
          text: practice,
          options: {
            fontFace: 'Arial',
            fontSize: 7,
            margin: 0,
            valign: 'middle',
            align: 'left',
            margin: [0, 0.1, 0, 0.1],
            border: {type: 'solid', pt: 1, color: 'd8d8d8'},
          },
          constCol: true,
        },
        {
          text: '',
          options: {
            fontFace: 'Arial',
            fontSize: 7,
            fill: colors.additionalColor,
            margin: 0,
            valign: 'middle',
            border: [
              {type: 'solid', pt: 1, color: 'ffffff'},
              {type: 'solid', pt: 0, color: colors.mainColor},
              {type: 'solid', pt: 1, color: 'ffffff'},
              {type: 'solid', pt: 1, color: 'ffffff'},
            ],
          },
          constCol: true,
        },
        {
          text: outcome.Practices[practice].Score,
          options: {
            fontFace: 'Arial',
            fontSize: 7,
            valign: 'middle',
            align: 'center',
            margin: [0, 0.12, 0, 0],
            color: colors.fontColor,
            fill: colors.mainColor,
          },
          constCol: true,
        },
      ]);
      for (const subsection in section) {
        var colors = getColorBasedOnRank(
          section[subsection].Outcomes[outcomeName].Practices[practice].Rank
        );
        outcomeArr[outcomeArr.length - 1].push(
          {
            text: '',
            options: {
              fontFace: 'Arial',
              fontSize: 7,
              fill: colors.additionalColor,
              margin: 0,
              valign: 'middle',
              border: [
                {type: 'solid', pt: 1, color: 'ffffff'},
                {type: 'solid', pt: 0, color: colors.mainColor},
                {type: 'solid', pt: 1, color: 'ffffff'},
                {type: 'solid', pt: 1, color: 'ffffff'},
              ],
            },
          },
          {
            text: section[subsection].Outcomes[outcomeName].Practices[practice].Score,
            options: {
              fontFace: 'Arial',
              fontSize: 7,
              valign: 'middle',
              align: 'center',
              margin: [0, 0.12, 0, 0],
              color: colors.fontColor,
              fill: colors.mainColor,
            },
          }
        );
      }
    }

    for (var i = 0; i < outcomeArr.length; i++) {
      arrTabRows.push(outcomeArr[i]);
    }
  }

  return arrTabRows;
}

function addSlidePractices(pptx, section, rawTitle, tables) {
  if (rawTitle.includes('|')) {
    var title = rawTitle.split('|')[1];
  } else {
    var title = rawTitle;
  }

  const slide = pptx.addSlide({masterName: 'TITLE_ONLY'});

  slide.addText('Practices by ' + title, {
    placeholder: 'header',
  });

  slide.addText(
    `Percentage of respondents who selected 'often' or 'almost always'`,
    subHeaderOptions
  );
  slide.addText(
    `Source: ${GlobalState.activeProject.DisplayName} (n=${testData.OVERALL.N}); Benchmark: Global (n=2887626, no. surveys=809)`,
    sourceTextOptions
  );
  addBenchmarkLegend(slide);

  //Generating table elements or using the passed ones
  if (tables) {
    var arrTabRows = tables;
  } else {
    var arrTabRows = generateTablePractice(section);
  }

  //Generating the only table on this slide if the table is short. Generating several pages otherwise
  if (arrTabRows[0].length <= 8) {
    slide.addTable(arrTabRows, {
      x: 0.6,
      y: 1.57,
      w: 12.11,
      h: 2.1,
      colW: generatePracticeColW(arrTabRows[2].length, 1.64, 2.3, 1.35),
      rowH: 0.12,
      border: {type: 'solid', pt: 1, color: 'ffffff'},
    });
  } else {
    var splitTable = splitTabRows(arrTabRows);
    var constRows = splitTable[0];
    var rowsToUse = splitTable[1];
    var rowsToPass = splitTable[2];

    for (const row in constRows) {
      arrTabRows[row] = constRows[row].concat(rowsToUse[row]);
      rowsToPass[row] = constRows[row].concat(rowsToPass[row]);
    }
    slide.addTable(arrTabRows, {
      x: 0.6,
      y: 1.57,
      w: 12.11,
      h: 2.1,
      colW: generatePracticeColW(arrTabRows[2].length, 1.64, 2.3, 1.35),
      rowH: 0.12,
      border: {type: 'solid', pt: 1, color: 'ffffff'},
    });
  }

  if (rowsToPass && rowsToPass[0].length > 3) {
    addSlidePractices(pptx, section, title, rowsToPass);
  }
}
//не генерить новый датасет, а проверять не передан ли старый в вызове функции и если передан, то пользовать его!

function splitTabRows(arrTabRows) {
  var scoresRows = [];
  var constRows = [];

  for (const row in arrTabRows) {
    constRows[row] = [];
    scoresRows[row] = [];
    for (const cell in arrTabRows[row]) {
      if (arrTabRows[row][cell].constCol) {
        constRows[row].push(arrTabRows[row][cell]);
      } else {
        scoresRows[row].push(arrTabRows[row][cell]);
      }
    }
  }
  var rowsToUse = [];

  for (const row in scoresRows) {
    if (row < 2) {
      rowsToUse[row] = [];
      rowsToUse[row] = scoresRows[row].splice(0, 5);
    } else {
      rowsToUse[row] = [];
      rowsToUse[row] = scoresRows[row].splice(0, 10);
    }
  }
  return [constRows, rowsToUse, scoresRows];
}

function addSlideOutcomes(pptx, section, rawTitle, tables) {
  if (rawTitle.includes('|')) {
    var title = rawTitle.split('|')[1];
  } else {
    var title = rawTitle;
  }

  const slide = pptx.addSlide({masterName: 'TITLE_ONLY'});

  //Generating common elements such as headers, legend, etc
  let arrTabRows = generateSlideOutcomesTop(slide, section, title);

  //Filling the table generating array

  if (tables && tables.length > 0) {
    arrTabRows = arrTabRows.concat(tables[0]);
  } else if (!tables) {
    for (const property in section) {
      arrTabRows.push(fillOutcomesRow(section, property));
    }
  }

  //Generating the only table on this slide if the table is short. Generating several pages otherwise
  if (arrTabRows.length - 2 <= 10) {
    slide.addTable(arrTabRows, {
      x: 0.6,
      y: 1.69,
      w: 12.11,
      h: 2.1,
      colW: generateOutcomesColW(arrTabRows[1].length, 2, 0.92),
      rowH: 0.33,
      border: {type: 'solid', pt: 1, color: 'ffffff'},
    });
    if (tables && tables.length > 1) {
      tables.splice(0, 1);
      addSlideOutcomes(pptx, section, title, tables);
    }
  } else {
    let tables = [];

    const pageCount = Math.ceil((arrTabRows.length - 2) / 10);
    tables[0] = arrTabRows.splice(0, 2);
    for (let i = 1; i <= pageCount; i++) {
      tables[i] = arrTabRows.splice(0, 10);
    }

    slide.addTable(tables[0].concat(tables[1]), {
      x: 0.6,
      y: 1.69,
      w: 12.11,
      h: 2.1,
      colW: generateOutcomesColW(tables[1][1].length, 2, 0.92),
      rowH: 0.33,
      border: {type: 'solid', pt: 1, color: 'ffffff'},
    });

    tables.splice(0, 2);

    if (tables.length > 0) {
      addSlideOutcomes(pptx, section, title, tables);
    }
  }
}

function generateSlideOutcomesTop(slide, section, title) {
  slide.addText('Outcomes by ' + title, {
    placeholder: 'header',
  });

  slide.addText(
    `Percentage of respondents who selected 'agree' or 'strongly agree'`,
    subHeaderOptions
  );
  slide.addText(
    `Source: ${GlobalState.activeProject.DisplayName} (n=${testData.OVERALL.N}); Benchmark: Global (n=2887626, no. surveys=809)`,
    sourceTextOptions
  );

  var arrTabRows = [];

  //Row zero
  arrTabRows.push([
    {text: '', options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'center'}},
    {text: 'N', options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'center'}},
    {
      text: 'OHI Score',
      options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'center', colspan: 2},
    },
  ]);

  var cols = section[Object.keys(section)[0]].Outcomes;
  var colNames = Object.keys(cols);

  for (var i = 0; i < colNames.length; i++) {
    arrTabRows[0].push({
      text: colNames[i],
      options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'center', colspan: 2},
    });
  }

  //overall row
  var colors = getColorBasedOnRank(testData.OVERALL.OHI.Rank);

  arrTabRows.push([
    {text: 'Overall', options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'left'}},
    {
      text: testData.OVERALL.N,
      options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'center'},
    },
    {
      text: '',
      options: {
        fill: colors.additionalColor,
        margin: 0,
        border: [
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 0, color: colors.mainColor},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'ffffff'},
        ],
      },
    },
    {
      text: testData.OVERALL.OHI.Score,
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: [5, 10, 5, 0],
        color: colors.fontColor,
        fill: colors.mainColor,
      },
    },
  ]);

  for (const property in testData.OVERALL.Outcomes) {
    var element = testData.OVERALL.Outcomes[property];
    var colors = getColorBasedOnRank(element.Rank);
    arrTabRows[1].push(
      {
        text: '',
        options: {
          fill: colors.additionalColor,
          margin: 0,
          border: [
            {type: 'solid', pt: 1, color: 'ffffff'},
            {type: 'solid', pt: 0, color: colors.mainColor},
            {type: 'solid', pt: 1, color: 'ffffff'},
            {type: 'solid', pt: 1, color: 'ffffff'},
          ],
        },
      },
      {
        text: element.Score,
        options: {
          fontFace: 'Arial',
          fontSize: 7,
          valign: 'middle',
          align: 'center',
          margin: [5, 10, 5, 0],
          color: colors.fontColor,
          fill: colors.mainColor,
        },
      }
    );
  }

  addBenchmarkLegend(slide);

  return arrTabRows;
}

function generatePracticeColW(arrLength, first, second, next) {
  var output = Array(arrLength);
  output[0] = first;
  output[1] = second;

  var yellow = next * 0.1;
  var regular = next * 0.9;
  for (var i = 2; i < arrLength; i += 2) {
    output[i] = yellow;
  }
  for (var i = 3; i < arrLength; i += 2) {
    output[i] = regular;
  }

  return output;
}

function generateOutcomesColW(arrLength, first, next) {
  var output = Array(arrLength);
  output[0] = first;
  output[1] = next;

  var yellow = next * 0.15;
  var regular = next * 0.85;
  for (var i = 2; i < arrLength; i += 2) {
    output[i] = yellow;
  }
  for (var i = 3; i < arrLength; i += 2) {
    output[i] = regular;
  }
  return output;
}

function fillOutcomesRow(section, property) {
  var cols = section[property].Outcomes;
  var output = [];
  var colors = getColorBasedOnRank(section[property].OHI.Rank);

  output.push(
    {
      text: section[property].Label,
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'left',
      },
    },
    {
      text: section[property].N,
      options: {fontFace: 'Arial', fontSize: 7, valign: 'middle', align: 'center'},
    },
    {
      text: '',
      options: {
        fill: colors.additionalColor,
        margin: 0,
        border: [
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 0, color: colors.mainColor},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'ffffff'},
        ],
      },
    },
    {
      text: section[property].OHI.Score,
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: [5, 10, 5, 0],
        color: colors.fontColor,
        fill: colors.mainColor,
      },
    }
  );

  for (const col in cols) {
    var colors = getColorBasedOnRank(cols[col].Rank);
    output.push({
      text: '',
      options: {
        fill: colors.additionalColor,
        margin: 0,
        border: [
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 0, color: colors.mainColor},
          {type: 'solid', pt: 1, color: 'ffffff'},
          {type: 'solid', pt: 1, color: 'ffffff'},
        ],
      },
    });
    output.push({
      text: cols[col].Score,
      options: {
        fontFace: 'Arial',
        fontSize: 7,
        valign: 'middle',
        align: 'center',
        margin: [5, 10, 5, 0],
        color: colors.fontColor,
        fill: colors.mainColor,
      },
    });
  }
  return output;
}

function addBenchmarkLegend(slide) {
  const textOptions = {
    x: 6.43,
    y: 1.33,
    h: 0.16,
    w: 0.94,
    color: '666666',
    align: 'left',
    valign: 'middle',
    margin: 0,
    fontSize: 9.2,
    fontFace: 'Arial',
  };
  const legendOptions = {
    x: 7.34,
    y: 1.33,
    w: 0.16,
    h: 0.16,
  };
  slide.addText(`Benchmark:`, {
    ...textOptions,
    color: '000000',
    bold: true,
  });
  slide.addShape('rect', {
    ...legendOptions,
    fill: {color: COLORS.topDecileStop},
  });
  slide.addShape('rect', {
    ...legendOptions,
    w: 0.048,
    fill: {color: COLORS.topDecileStart},
  });
  slide.addText(`Top Decile`, {
    ...textOptions,
    x: 7.6,
  });
  slide.addShape('rect', {
    ...legendOptions,
    x: 8.26,
    fill: {color: COLORS.topQuartile},
  });
  slide.addText(`Top Quartile`, {
    ...textOptions,
    x: 8.52,
  });
  slide.addShape('rect', {
    ...legendOptions,
    x: 9.28,
    fill: {color: COLORS.secondQuartile},
  });
  slide.addText(`Second Quartile`, {
    ...textOptions,
    x: 9.54,
  });
  slide.addShape('rect', {
    ...legendOptions,
    x: 10.49,
    fill: {color: COLORS.thirdQuartile},
  });
  slide.addText(`Third Quartile`, {
    ...textOptions,
    x: 10.75,
  });
  slide.addShape('rect', {
    ...legendOptions,
    x: 11.58,
    fill: {color: COLORS.bottomQuartile},
  });
  slide.addText(`Bottom Quartile`, {
    ...textOptions,
    x: 11.85,
  });
}

function addOHIScoreShape(slide, positionAndSize, rank, score, bgColor = 'FFFFFF') {
  const colors = getColorBasedOnRank(rank);
  slide.addShape('roundRect', {
    ...positionAndSize,
    fill: {color: colors.mainColor},
    line: {color: colors.additionalColor, width: 2},
    rectRadius: positionAndSize.width * 0.2,
  });
  slide.addShape('rect', {
    y: positionAndSize.y - positionAndSize.h * 0.05,
    x: positionAndSize.x + positionAndSize.w / 2 - positionAndSize.w * 0.05,
    w: positionAndSize.w * 0.1,
    h: positionAndSize.h * 1.1,
    fill: {color: bgColor},
  });
  slide.addShape('ellipse', {
    y: positionAndSize.y + positionAndSize.h * 0.15,
    x: positionAndSize.x + positionAndSize.h * 0.15,
    w: positionAndSize.w * 0.7,
    h: positionAndSize.h * 0.7,
    fill: {color: bgColor},
  });
  slide.addText(`${score}`, {
    x: positionAndSize.x + positionAndSize.w * 0.2,
    y: positionAndSize.y + positionAndSize.h * 0.2,
    w: positionAndSize.w * 0.6,
    h: positionAndSize.h * 0.6,
    color: '000000',
    align: 'center',
    valign: 'middle',
    margin: 0,
    fontSize: Math.ceil(positionAndSize.h * 23),
    fontFace: 'Arial',
    bold: true,
  });
}

function addRecipeAlignmentBlock(slide, position, recipe) {
  slide.addShape('rect', {
    ...position,
    h: 0.84,
    w: 3.22,
    line: {color: '000000', width: 1},
  });
  slide.addText(`Recipe Alignment`, {
    x: position.x + 0.1,
    y: position.y + 0.07,
    w: 2,
    h: 0.21,
    color: '000000',
    align: 'left',
    valign: 'middle',
    margin: 0,
    fontFace: 'Arial',
    fontSize: 13,
    bold: true,
  });
  const recipeName = recipe.Id.match(/(?<=\().+?(?=\))/g)[0];
  slide.addText(`${recipeName}`, {
    x: position.x + 0.1,
    y: position.y + 0.33,
    w: 2,
    h: 0.21,
    color: '000000',
    align: 'left',
    valign: 'middle',
    margin: 0,
    fontFace: 'Arial',
    fontSize: 11,
    bold: true,
  });
  const recipeAlignment = Math.round((recipe.Alignment + Number.EPSILON) * 10) / 10;
  slide.addText(`${recipeAlignment}`, {
    x: position.x + 0.1,
    y: position.y + 0.58,
    w: 2,
    h: 0.21,
    color: '8C5AC8',
    align: 'left',
    valign: 'middle',
    margin: 0,
    fontFace: 'Arial',
    fontSize: 11,
    bold: true,
  });
  const recipeType = recipe.Id.trim().split(' ')[1];
  slide.addImage({
    path: imagesOHI[`recipe${recipeType}.svg`],
    x: position.x + 2.1,
    y: position.y + 0.1,
    w: 1,
    h: 0.7,
  });
}

function addOutcomeBlock(slide, position, sizes, data) {
  const {practiceTileHeight, practiceTileWidth, outcomeTileWidth, practiceTileMargin} = sizes;

  const practices = objectOfObjectsToArrayOfObjects(data.Practices);

  let {mainColor, additionalColor, fontColor} = getColorBasedOnRank(data.Rank);

  slide.addShape('rect', {
    ...position,
    h: practiceTileHeight * practices.length + practiceTileMargin * (practices.length - 1),
    w: outcomeTileWidth,
    fill: {color: mainColor},
  });
  const outcomeAdditionalColorWidth = outcomeTileWidth * 0.05;
  slide.addShape('rect', {
    ...position,
    h: practiceTileHeight * practices.length + practiceTileMargin * (practices.length - 1),
    w: outcomeAdditionalColorWidth,
    fill: {color: additionalColor},
  });
  slide.addText(`${data.Id}\n${data.Score}`, {
    x: position.x, // + outcomeAdditionalColorWidth,
    y: position.y,
    w: outcomeTileWidth, // - outcomeAdditionalColorWidth,
    h: practiceTileHeight * practices.length + practiceTileMargin * (practices.length - 1),
    color: fontColor,
    align: 'center',
    valign: 'middle',
    margin: 0.1,
    fontFace: 'Arial',
    fontSize: 11,
    bold: true,
  });
  practices.forEach((practice, index) => {
    ({mainColor, additionalColor, fontColor} = getColorBasedOnRank(practice.Rank));
    const x = position.x + outcomeTileWidth + practiceTileMargin;
    const y = position.y + index * (practiceTileHeight + practiceTileMargin);
    const additionalColorWidth = practiceTileWidth * 0.05;
    slide.addShape('rect', {
      x,
      y,
      h: practiceTileHeight,
      w: practiceTileWidth,
      fill: {color: mainColor},
    });
    slide.addShape('rect', {
      x,
      y,
      h: practiceTileHeight,
      w: additionalColorWidth,
      fill: {color: additionalColor},
    });
    slide.addText(`${practice.Id}`, {
      x: x + additionalColorWidth + 0.05,
      y,
      w: practiceTileWidth - practiceTileWidth * 0.14 - 0.1,
      h: practiceTileHeight,
      color: fontColor,
      align: 'left',
      valign: 'middle',
      margin: 0,
      fontFace: 'Arial',
      fontSize: 9,
    });
    slide.addText(`${practice.Score}`, {
      x: x + practiceTileWidth - additionalColorWidth - 0.3,
      y,
      w: 0.25,
      h: practiceTileHeight,
      color: fontColor,
      align: 'right',
      valign: 'middle',
      margin: 0,
      fontFace: 'Arial',
      fontSize: 9,
    });
  });
}

function downloadPowerPointOHI(data) {
  // 1. Create a Presentation
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_WIDE';

  const logoRatio = 1258 / 2000;
  const logoWidth = 2.1; // inches

  const bgRatio = 1440 / 2560;
  const bgWidth = 13.33; // inches

  pptx.defineSlideMaster({
    title: 'Master1',
    background: {
      color: 'FFFFFF',
    },

    objects: [
      {
        image: {
          path: imagesOHI['mckinsey_logo.jpg'],
          x: MARGIN_LEFT,
          y: 0.16,
          w: logoWidth,
          h: logoWidth * logoRatio,
        },
      },
      {
        image: {
          path: imagesOHI['image2.png'],
          x: '0%',
          y: 0,
          w: bgWidth,
          h: bgWidth * bgRatio,
        },
      },
    ],
  });

  pptx.defineSlideMaster({
    title: 'TITLE_ONLY',
    background: {color: 'FFFFFF'},
    objects: [
      {rect: {x: MARGIN_LEFT, y: 1.29, w: 12.1, h: 0.005, fill: {color: '000000'}}},
      {rect: {x: MARGIN_LEFT, y: 7.05, w: 12.1, h: 0.005, fill: {color: '000000'}}},
      {text: {text: 'McKinsey & Company', options: {x: 11, y: 7.17, fontSize: 10}}},
      {
        placeholder: {
          options: {
            name: 'header',
            type: 'title',
            x: MARGIN_LEFT,
            y: 0.57,
            w: 12,
            h: 0.42,
            color: '000000',
            align: pptx.AlignH.left,
            valign: 'middle',
            margin: 0,
            fontFace: 'Georgia',
            fontSize: 25,
            bold: true,
          },
          text: '',
        },
      },
    ],
    slideNumber: {x: 12.47, y: 7.05, h: 0.2, fontSize: 10},
  });

  pptx.addSection({title: 'Cover Page'});
  addSlide0(pptx);

  pptx.addSection({title: 'Health Statistics and Scorecard'});
  addSlideScorecard(pptx, data);

  for (const section in testData) {
    if (section != 'OVERALL') {
      addSlideOutcomes(pptx, testData[section], section);
    }
  }

  for (const section in testData) {
    if (section != 'OVERALL') {
      addSlidePractices(pptx, testData[section], section);
    }
  }

  // Save the Presentation
  pptx
    .writeFile({
      fileName: `${GlobalState.activeProject.DisplayName.replace('.', ' ')}.pptx`,
    })
    .then(() => {
      document.querySelector('#download-report-button').classList.remove('hidden');
      document.querySelector('#download-report-loader').classList.add('hidden');
    });
}

function downloadPowerPointWeeklyAttitudePulse(data) {
  const quotes = data;

  // 1. Create a Presentation
  const pptx = new PptxGenJS();

  const logoRatio = 1258 / 2000;
  const logoWidth = 1.5; // inches

  const bgRatio = 1440 / 2560;
  const bgWidth = 10;

  const now = new Date();

  pptx.defineSlideMaster({
    title: 'Master1',
    background: {
      color: 'FFFFFF',
    },

    objects: [
      {
        image: {
          path: imagesOHI['mckinsey_logo.jpg'],
          x: 0.4,
          y: 0.15,
          w: logoWidth,
          h: logoWidth * logoRatio,
        },
      },
      {
        image: {
          path: imagesOHI['image2.png'],
          x: '0%',
          y: 0,
          w: bgWidth,
          h: bgWidth * bgRatio,
        },
      },
    ],
  });

  const faceWidth = 5.625;
  const faceRatio = 1;

  const quoteWidth = 0.5;
  const quoteRatio = 600 / 800;

  pptx.defineSlideMaster({
    title: 'Face',
    background: {
      color: 'FFFFFF',
    },

    objects: [
      {
        image: {
          path: imagesOHI['mckinsey_logo.jpg'],
          x: 0.4,
          y: 0.15,
          w: logoWidth,
          h: logoWidth * logoRatio,
        },
      },
      {
        image: {
          path: imagesOHI['quote.png'],
          x: 0.4,
          y: 1.5,
          w: quoteWidth,
          h: quoteRatio * logoRatio,
        },
      },
      {
        image: {
          path: imagesOHI['pulse.jpg'],
          x: '44%',
          y: 0,
          w: faceWidth,
          h: faceWidth * faceRatio,
        },
      },
    ],
  });

  // 2. Add a Slide to the presentation
  pptx.addSection({title: 'Cover Page'});
  const slide = pptx.addSlide({
    masterName: 'Master1',
    sectionTitle: 'Section Title',
  });

  // 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
  slide.addText(GlobalState.activeProject.DisplayName, {
    x: 0.5,
    y: 1.2,
    w: '42%',
    h: 2,
    color: '363636',
    //fill: { color: "FFFFFF" },
    align: pptx.AlignH.left,
    valign: 'bottom',
    fontFace: 'Georgia',
    fontSize: 24,
    bold: true,
  });

  slide.addText(`${now}`, {
    color: '363636',
    x: 0.5,
    y: 3.3,
    h: 0.5,
    fontSize: 10,
    fontFace: 'Arial',
    align: pptx.AlignH.left,
    valign: 'top',
  });

  pptx.addSection({title: 'Quotes'});

  /*
      var quotes = [
          "I long to accomplish a great and noble task, but it is my chief duty to accomplish humble tasks as though they were great and noble. The world is moved along, not only by the mighty shoves of its heroes, but also by the aggregate of the tiny pushes of each honest worker.",
          "If you explore beneath shyness or party chit-chat, you can sometimes turn a dull exchange into an intriguing one. I've found this to be particularly true in the case of professors or intellectuals, who are full of fascinating information, but need encouragement before they'll divulge it.",
          "That's the worst of growing up, and I'm beginning to realize it. The things you wanted so much when you were a child don't seem half so wonderful to you when you get them."
      ];
      */

  // 2. Add a Slide to the presentation

  for (let i = 0; i < quotes.length; i += 1) {
    const quoteSlide = pptx.addSlide({
      masterName: 'Face',
      sectionTitle: 'Quotes',
    });

    quoteSlide.addText(quotes[i], {
      color: '363636',
      x: 0.5,
      y: '40%',
      w: '35%',
      h: '50%',
      fontSize: 14,
      fontFace: 'Arial',
      align: pptx.AlignH.left,
      valign: 'top',
    });
  }

  // 4. Save the Presentation
  pptx.writeFile({
    fileName: `${GlobalState.activeProject.DisplayName.replace('.', ' ')}.pptx`,
  });
}
