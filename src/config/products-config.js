import OHIThumbnailImage from '../assets/images/ohi-thumb.jpg';
import OHIMainImage from '../assets/images/ohi-half-hero.jpg';
import WeeklyAttitudePulseThumbnailImage from '../assets/images/weekly-attitude-pulse-thumb.jpg';
import OrgLabThumbnailImage from '../assets/images/orglab-thumb.jpeg';
// eslint-disable-next-line import/prefer-default-export
export const PRODUCTS = {
  // OHI
  '1': {
    Name: 'Organizational Health Index (OHI)',

    Active: true, //use Active: false to soft delete product

    TagLine: 'Put real numbers and targeted actions on organizational health',

    Description:
      'An organization’s health—its ability to align around and achieve strategic goals—is critical for long-term performance. However, many leaders overlook organizational health because they lack a clear way to measure and improve it. Organizational Health Index (OHI) applies analytical rigor to organizational health management. Our quantitative diagnostics and proven recipes for success empower senior leaders to measure and achieve the organizational health required to sustain long-term performance.',

    SurveyUrl: 'https://survey.us.confirmit.com/wix/p522554084612.aspx', //p522554084612 - real, p328344271965 - test

    Icons: {
      Thumbnail: OHIThumbnailImage,

      Main: OHIMainImage,
    },

    Demos: [
      {
        Label: 'Who are you?',
        Url: 'https://survey.us.confirmit.com/wix/p608313972730.aspx?qid=mck_ohi',
      },

      {
        Label: 'Scoring Explained',
        Url: 'https://survey.us.confirmit.com/wix/p608313972730.aspx?qid=mck_ohi2',
      },

      {
        Label: 'Relative Strengths',
        Url: 'https://survey.us.confirmit.com/wix/p608313972730.aspx?qid=mck_ohi3',
      },
    ],

    Benefits: [
      {
        Title: 'Benchmark your health',
        Text:
          'The OHI benchmark provides leaders with a detailed picture of their organizations’ health compared to peers. With over 1 billion data points across geographies and industries, it offers a global standard to measure and manage organizational health.',
      },

      {
        Title: 'Align your organization',
        Text:
          'Sustained performance requires different functions, teams, geographies, and tenure levels to share a common set of goals and priorities. The OHI helps leaders find the disconnects and get everyone on the same page.',
      },

      {
        Title: 'Drive organizational performance',
        Text:
          'The OHI survey and benchmarking data explain up to 50 percent of performance variations within companies. This helps leaders analyze the impact of company practices and culture on performance and create an implementation roadmap to improve it.',
      },
    ],

    Numbers: [
      {
        Metric: '2,500+',
        Label: 'client engagements',
      },

      {
        Metric: '100+',
        Label: 'countries',
        Sub: 'in the database',
      },

      {
        Metric: '7M+',
        Label: 'OHI responses',
      },
    ],

    Config: {
      /*
              About: {
                  Label: "About",
                  Sub: "How to use",
                  Icon: "fa-solid fa-circle-info",
                  Description: "Contents coming.<br><br>This tab will have information about the configuration process for new users.",
                  Contents: {}
              },
              */

      Layout: {
        Label: 'Layout',
        Sub: 'Survey design',
        Icon: 'fa-solid fa-palette',
        Description: 'Selections on this tab determine the look and feel of your OHI survey.',
        Contents: {
          Palette: {
            Label: 'Theme',
            Description:
              'Select a layout theme for your OHI survey. Choose from three standard themes.',
            Type: 'Dropdown',
            DefaultValue: 'mckinsey',
            Options: {
              mckinsey: {
                Label: 'Dark',
                Data: ['#051C2C', '#00a9f4', '#F0F0F0', '#F5F6FA'],
              },
              // minty: {
              //   Label: 'Minty',
              //   Data: ['#21D59B', '#e4f9fc', '#0058ff', '#F5F6FA'],
              // },
              neutral: {
                Label: 'Light',
                Data: ['#FFFFFF', '#50C878', '#F5F6F8', '#F5F6FA'],
              },
            },
            HasPreview: true,
          },
        },
      },

      Wording: {
        Label: 'Wording',
        Sub: 'Survey terms',
        Icon: 'fa-solid fa-spell-check',
        Description: 'Selections on this tab impact how questions in your OHI survey are worded.',
        Contents: {
          CompanyWording: {
            Label: 'Wording: Company',
            Description: 'What word best describes the entity that is $company$?',
            Type: 'Dropdown',
            DefaultValue: 'company',
            Options: {
              company: {Label: 'Company'},
              corporation: {Label: 'Corporation'},
              enterprise: {Label: 'Enterprise'},
              institution: {Label: 'Institution'},
              organization: {Label: 'Organization'},
              $company$: {Label: '$company$'},
            },
            HasPreview: true,
            PreviewData: [
              '<span class="dynamic-article " default-word="The">The</span> [CompanyWording] translates its vision into specific strategic goals and milestones',
              '<span class="dynamic-article " default-word="The">The</span> [CompanyWording] communicates clear standards of work',
            ],
          },

          EmployeeWording: {
            Label: 'Wording: Employee',
            Description: 'What word best describes the people who work for $company$?',
            Type: 'Dropdown',
            DefaultValue: 'employees',
            Options: {
              agents: {Label: 'Agents'},
              associates: {Label: 'Associates'},
              employees: {Label: 'Employees'},
              members: {Label: 'Members'},
              representatives: {Label: 'Representatives'},
              workers: {Label: 'Workers'},
              staff: {Label: 'Staff'},
              colleagues: {Label: 'Colleagues'},
              partners: {Label: 'Partners'},
            },
            HasPreview: true,
            PreviewData: [
              '<span class="dynamic-article " default-word="The">The</span> [CompanyWording] has a vision for the future that is both easy to understand and meaningful to [EmployeeWording]',
              'Results are made internally transparent to help motivate [EmployeeWording] to perform',
            ],
          },

          ManagersWording: {
            Label: 'Wording: Managers',
            Description:
              'What word best describes a person responsible for controlling or administering in $company$?',
            Type: 'Dropdown',
            DefaultValue: 'managers',
            Options: {
              managers: {Label: 'Managers'},
              supervisors: {Label: 'Supervisors'},
              //executives: {Label: 'Executives'},
              administrators: {Label: 'Administrators'},
              administration: {Label: 'Administration'},
            },
            HasPreview: true,
            PreviewData: [
              '[ManagersWording] consult with [EmployeeWording] on issues that affect them',
              '[ManagersWording] encourage honesty, transparency, and candid, open dialogue',
            ],
          },

          LeadersWording: {
            Label: 'Wording: Leaders',
            Description: 'Which word best describes senior leadership in $company$?',
            Type: 'Dropdown',
            DefaultValue: 'leaders',
            Options: {
              leaders: {Label: 'Leaders'},
              chiefs: {Label: 'Chiefs'},
              principals: {Label: 'Principals'},
              executives: {Label: 'Executives'},
              //'senior leaders': {Label: 'Senior Leaders'},
            },
            HasPreview: true,
            PreviewData: [
              'Senior [LeadersWording] clearly communicate a set of values that are personally meaningful to [EmployeeWording]',
              'Senior [LeadersWording] devote sufficient attention to doing things differently',
            ],
          },

          BossWording: {
            Label: 'Wording: Boss',
            Description: 'Which word best describes a people manager in $company$?',
            Type: 'Dropdown',
            DefaultValue: 'boss',
            Options: {
              boss: {Label: 'Boss'},
              head: {Label: 'Head'},
              supervisor: {Label: 'Supervisor'},
              'team leader': {Label: 'Team leader'},
              manager: {Label: 'Manager'},
            },
            HasPreview: true,
            PreviewData: [
              '[LeadersWording] in <span class="dynamic-article " default-word="the">the</span> [CompanyWording] (including my [BossWording]) make high quality decisions',
              'My [BossWording] provides continual pressure and influence',
            ],
          },

          CustomersWording: {
            Label: 'Wording: Customers',
            Description: 'Which word best describes people who use services of $company$?',
            Type: 'Dropdown',
            DefaultValue: 'customers',
            Options: {
              customers: {Label: 'Customers'},
              consumers: {Label: 'Consumers'},
              purchasers: {Label: 'Purchasers'},
              clients: {Label: 'Clients'},
              'service users': {Label: 'Service users'},
            },
            HasPreview: true,
            PreviewData: [
              '<span class="dynamic-article " default-word="The">The</span> [CompanyWording]  effectively manages external business relationships with [CustomersWording], partners, and stakeholders',
              "<span class='dynamic-article 'default-word='The'>The</span> [CompanyWording] identifies and targets specific groups of [CustomersWording] with tailored offerings",
            ],
          },
        },
        //BottomElement:
        //  '<div class="tab-content__description">Need a different wording option? <span class="tab-content__clickable" id="wording-help">Request project assistance</span></div>',
      },

      Contents: {
        Label: 'Optional Content',
        Sub: 'Pick your questions',
        Icon: 'fa-solid fa-circle-question',
        Description:
          'Selections on this tab decide what optional questions - on top of standard questions and content - will be included in your OHI survey.',
        Contents: {
          Demos: {
            Label: 'Demographics',
            Description: 'Which demographic questions would you like to include?',
            Type: 'Multi',
            Options: {
              demo_SubBU: {Label: 'Sub-business unit'},
              demo_Region: {Label: 'Region'},
              demo_Ethnicity: {Label: 'Ethnicity'},
              demo_AgeYear: {Label: 'Birth Year'},
              demo_Gender: {Label: 'Gender'},
              demo_SexOrientation: {Label: 'Sexual Orientation'},
              demo_Tenure: {Label: 'Years at Organization'},
              demo_Level: {Label: 'Job level'},
              demo_Function: {Label: 'Job Function'},
              demo_Location: {Label: 'Location'},
            },
            DefaultValue: [
              'demo_SubBU',
              'demo_Region',
              'demo_Ethnicity',
              'demo_AgeYear',
              'demo_Gender',
              'demo_SexOrientation',
              'demo_Tenure',
              'demo_Level',
              'demo_Function',
              'demo_Location',
            ],
          },

          OpenEnds: {
            Label: 'Open-ended Questions',
            Description:
              'Select any additional open-ended questions for your OHI survey. You may leave all unchecked.',
            Type: 'Multi',
            Options: {
              open_ThreeWords: {Label: 'Please describe $company$ in three words.'},
              open_Strengths: {Label: "What are $company$'s strengths?"},
              open_Weaknesses: {
                Label: "What are $company$'s opportunities for improvement?",
              },
              open_Thoughts: {
                Label: 'Please take a few moments to add any additional thoughts or suggestions.',
              },
            },
            DefaultValue: [],
          },
        },
      },

      PreviewSurvey: {
        Label: 'Preview Survey',
        Sub: 'View final survey',
        Icon: 'fa-solid fa-eye',
        Description: 'Preview the final survey with all the options you have chosen applied.',
        Contents: {
          FinalSurvey: {
            Label: 'Preview',
            Description:
              'The options you have configured for your OHI survey are shown below. You can change them by clicking on the tabs above.',
            Type: 'Info',
            HasPreview: true,
          },
        },
      },

      EmailManagement: {
        Label: 'Email management',
        Sub: 'Edit invitation / reminders',
        Icon: 'fa-solid fa-envelope',
        Description: 'Edit invitation / reminder templates below.',

        Contents: {
          Invitation: {
            Label: 'Edit Invitation',
            Description: '',
            Type: 'Open',
            HasPreview: true,
            DefaultValue: `<p>You recently received an email announcing the launch of a diagnostic effort to better understand your organization's health - this is your personal invitation to the <b>Organizational Health Index (OHI) Survey</b>.</p>
              <p>Below you will find the link to the OHI survey. Please do not forward it to anyone else, in order to protect the confidentiality of your responses.</p>
              <p>Please take 20 minutes as soon as possible to complete the survey.<br>
              <p>Thank you in advance for completing this survey!</p>`,
          },
          Reminder: {
            Label: 'Edit Reminder',
            Description: '',
            Type: 'Open',
            HasPreview: true,
            DefaultValue: `<p>This is to remind you about the ongoing <b>Organizational Health Index (OHI) Survey</b>.</p>
              <p>Below you will find the link to the OHI survey. Please do not forward it to anyone else, in order to protect the confidentiality of your responses.</p>
              <p>Please take 20 minutes as soon as possible to complete the survey.</p>
              <p>Thank you in advance for completing this survey!</p>`,
          },
          FinalReminder: {
            Label: 'Edit Final Reminder',
            Description: '',
            Type: 'Open',
            HasPreview: true,
            DefaultValue: `<p>This is the last day to fill out the <b>Organizational Health Index (OHI) survey</b>.</p>
              <p>Below you will find the link to the OHI survey. Please do not forward it to anyone else, in order to protect the confidentiality of your responses.</p>
              <p>Please take 20 minutes as soon as possible to complete the survey.</p>
              <p>Thank you in advance for completing this survey!</p>`,
          },
        },
      },
    },
  },

  // Weekly Attitude Pulse
  '3': {
    Name: 'Weekly Attitude Pulse',
    Active: true,

    TagLine:
      'Keep track of the sentiment of your organization and close the loop with your employees.',

    Description:
      'In every organization, the changing nature of work and the broader environment impact employees’ experiences. If you’re only measuring once every 6 or 12 months, you could be missing these shifting attitudes. Using a simple, lightweight attitude check on a weekly basis you can keep tabs on how the whole company is reacting to the shifting world around them. In addition, it gives people the option to request further follow-up; which drives engagement, willingness to respond, and gives your team in-depth insight that you otherwise would have missed.',

    SurveyUrl: 'https://survey.us.confirmit.com/wix/p596224084960.aspx',

    Icons: {
      Thumbnail: WeeklyAttitudePulseThumbnailImage,
      Main: WeeklyAttitudePulseThumbnailImage,
    },

    //Demos: [],

    Numbers: [
      {
        Metric: '300+',
        Label: 'participating companies',
      },

      {
        Metric: '75%',
        Label: 'Average weekly response rate',
      },

      {
        Metric: '8.5%',
        Label: 'Average increase in sentiment after 6 months',
      },
    ],

    Config: {
      Notifications: {
        Label: 'Notifications',
        Sub: 'Define Recipient',
        Icon: 'fa-sharp fa-solid fa-envelope',
        Description: '',
        Contents: {
          NotificationEmail: {
            Label: 'Email',
            Description:
              '(Optional) Email address to receive notifications from employees who request to be contacted.',
            Type: 'Open',
            DefaultValue: '',
            HasPreview: false,
          },
        },
      },
    },
  },

  // ORGLAB
  '2': {
    Name: 'OrgLab',

    Active: false,

    TagLine: 'Build a better organization and make the change stick',

    Description:
      'In high-performing organizations, dynamic teams address top priorities with the right talent in the right roles. But creating that kind of workplace requires understanding where value really comes from and ensuring the right work is being done in the right structure. OrgLab offers a powerful platform for designing a better organization and then guiding the steps needed to make lasting change.',

    Icons: {
      Main: OrgLabThumbnailImage,
      Thumbnail: OrgLabThumbnailImage,
    },

    Benefits: [
      {
        Title: 'Talent to value',
        Text:
          'We put value at the center of operating model work, identifying the most critical roles throughout the organization and ensuring that top talent is deployed where it matters.',
      },

      {
        Title: 'Smart delayering',
        Text:
          'Our advanced analytics highlight opportunities to optimize spans of control and reduce excessive layers, empowering efficient management and faster decision making.',
      },

      {
        Title: 'Team effectiveness',
        Text:
          'We employ tools to visualize the teams within an organization, quickly identifying capability and capacity gaps and identifying opportunities to make teamwork more efficient.',
      },
    ],

    Numbers: [
      {
        Metric: '4x',
        Label: 'increase',
        Sub: 'in success rates',
      },

      {
        Metric: '30%',
        Label: 'managerial',
        Sub: 'cost savings',
      },

      {
        Metric: '50%',
        Label: 'faster',
        Sub: 'design and execution',
      },
    ],

    Config: {
      About: {
        Label: 'About',
        Sub: 'OrgLab',
        Icon: 'fa-solid fa-circle-info',
        Description: 'OrgLab was included as a research product for illustrative purposes only.',
        Contents: {
          QuickPoll: {
            Label: 'Quick Poll',
            Description: 'Would you like to see more research products in the portal?',
            Type: 'Dropdown',
            DefaultValue: 'Yes',
            Options: {
              '-': {Label: ''},
              Y: {Label: 'Yes'},
              N: {Label: 'No'},
              NA: {Label: 'No opinion'},
            },
            HasPreview: false,
          },
        },
      },
    },
  },
};
