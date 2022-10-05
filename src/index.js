import './styles.css';
import './template/init';
import LoadHelp from './pages/page-help';
import mainImage from './assets/images/the-top-technology-trends-of-2022_1296421142_thumb_1536x1536-v3.jpg';

var token = null;
var projects = null; // array of records
var active_project = null; // individual record
var user = null;

const Partners = {
	mck: {
		MainImgUrl: mainImage, // "https://www.mckinsey.com/~/media/mckinsey/careers%20redesign/forward/forward-page-thumb_1536x1536_1076927118.jpg",
		LogoUrl:
			'https://www.freelogovectors.net/wp-content/uploads/2022/06/mckinsey-logo-freelogovectors.net_.png',
	},

	forsta: {
		MainImgUrl:
			'https://images.pexels.com/photos/1147124/pexels-photo-1147124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		LogoUrl:
			'https://assets.greenbook.org/logos/Forsta_Logo_RGB_FINAL_no%20space%20around-01%20(002)_pp1490558637792249377658838.png',
	},
};

const Products = {
	// OHI
	'1': {
		Name: 'Organizational Health Index (OHI)',

		TagLine: 'Put real numbers and targeted actions on organizational health',

		Description:
			'An organization’s health—its ability to align around and achieve strategic goals—is critical for long-term performance. However, many leaders overlook organizational health because they lack a clear way to measure and improve it. Organizational Health Index (OHI) applies analytical rigor to organizational health management. Our quantitative diagnostics and proven recipes for success empower senior leaders to measure and achieve the organizational health required to sustain long-term performance.',

		SurveyUrl: 'https://survey.us.confirmit.com/wix/p436156196230.aspx',

		Icons: {
			Thumbnail:
				'https://www.mckinsey.com/~/media/mckinsey/mckinsey%20solutions/orgsolutions/overview/ohi/ohi_thumb_151329137_1536x1536.jpg?mw=677&car=42:25',

			Main:
				'https://www.mckinsey.com/~/media/mckinsey/mckinsey%20solutions/orgsolutions/overview/ohi/ohi-half-hero_151329137_1536x768.jpg?mw=1536&car=19:10&cpx=Right&cpy=Center',
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
				Sub: 'Survey look-and-feel',
				Icon: 'fa-solid fa-palette',
				Description: 'Selections on this tab drive the look-and-feel of your OHI survey.',
				Contents: {
					Palette: {
						Label: 'Theme',
						Description:
							'Select a layout theme for your OHI survey. Choose from three standard themes.',
						Type: 'Dropdown',
						DefaultValue: 'mckinsey',
						Options: {
							mckinsey: {
								Label: 'McKinsey',
								Data: ['#051C2C', '#2251FF', '#F0F0F0', '#F5F6FA'],
							},
							minty: {
								Label: 'Minty',
								Data: ['#21D59B', '#e4f9fc', '#0058ff', '#F5F6FA'],
							},
							neutral: {
								Label: 'Neutral',
								Data: ['#FFFFFF', '#50C878', '#F5F6F8', '#F5F6FA'],
							},
						},
						HasPreview: true,
					},
				},
			},

			Wording: {
				Label: 'Wording',
				Sub: 'Survey texts',
				Icon: 'fa-solid fa-spell-check',
				Description:
					'Selections on this tab impact how questions in your OHI survey are worded.',
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
							corporation: {Label: 'Corporation'},
						},
						HasPreview: true,
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
						},
						HasPreview: true,
					},
				},
			},

			Contents: {
				Label: 'Optional Content',
				Sub: 'Pick your questions',
				Icon: 'fa-solid fa-circle-question',
				Description:
					'Selections on this tab decide what optional questions - on top of standard questions and content - will be included in your OHI survey.',
				Contents: {
					OpenEnds: {
						Label: 'Open-ended Questions',
						Description:
							'Select additional open-ended questions for your OHI survey. You may leave all unchecked.',
						Type: 'Multi',
						Options: {
							q1: {Label: 'Describe $company$ in three words.'},
							q2: {Label: "What are $company$'s strengths?"},
							q3: {
								Label: "What are $company$'s opportunities for improvement?",
							},
							q4: {
								Label:
									'Please take a few moments to add any additional thoughts or suggestions?',
							},
						},
					},

					Demos: {
						Label: 'Demographics',
						Description: 'What demos do you want to use?',
						Type: 'Multi',
						Options: {
							age: {Label: 'Age'},
							gender: {Label: 'Gender'},
						},
					},
				},
			},
		},
	},

	// Weekly Attitude Pulse
	'3': {
		Name: 'Weekly Attitude Pulse',

		TagLine:
			'Keep track of the sentiment of your organization and close the loop with your employees.',

		Description:
			'In every organization, the changing nature of work and the broader environment impact employees’ experiences. If you’re only measuring once every 6 or 12 months, you could be missing these shifting attitudes. Using a simple, lightweight attitude check on a weekly basis you can keep tabs on how the whole company is reacting to the shifting world around them. In addition, it gives people the option to request further follow-up; which drives engagement, willingness to respond, and gives your team in-depth insight that you otherwise would have missed.',

		SurveyUrl: 'https://survey.us.confirmit.com/wix/p596224084960.aspx',

		Icons: {
			Thumbnail:
				'https://images.pexels.com/photos/6203473/pexels-photo-6203473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',

			Main:
				'https://images.pexels.com/photos/6203473/pexels-photo-6203473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
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

		TagLine: 'Build a better organization and make the change stick',

		Description:
			'In high-performing organizations, dynamic teams address top priorities with the right talent in the right roles. But creating that kind of workplace requires understanding where value really comes from and ensuring the right work is being done in the right structure. OrgLab offers a powerful platform for designing a better organization and then guiding the steps needed to make lasting change.',

		Icons: {
			Main:
				'https://images.pexels.com/photos/8101985/pexels-photo-8101985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			Thumbnail:
				'https://images.pexels.com/photos/8101985/pexels-photo-8101985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
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
				Description:
					'OrgLab was included as a research product for illustrative purposes only.',
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

const URL = {
	Api: 'https://survey.us.confirmit.com/wix/p194169735738.aspx',
};

function GetTimeline(items) {
	var o = [];

	o.push(`
	<div class="section_inner" style="padding-left: 0; padding-top: 10px;">
		<div class="cavani_tm_about">
			<div class="resume">
				<div class="wrapper">
					<div class="education">
						<div class="cavani_tm_title">
							<span>Timeline</span>
						</div>
						<div class="list">
							<div class="univ">
								<ul>
	`);

	for (var i = 0; i < items.length; ++i) {
		var item = items[i];
		o.push(`
										<li>
											<div class="list_inner">
												<div class="time">
													<span>${item.Time}</span>
												</div>
												<div class="place">
													<h3>${item.Text}</h3>
													<span>${item.Subtext}</span>
												</div>
											</div>
										</li>
		`);
	}

	o.push(`
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`);

	return o.join('');
}

function GetConfig() {
	var cfg = Products[active_project.ProductId].Config;
	var c = {};

	for (var tab_id in cfg) {
		var tab = cfg[tab_id];

		for (var key in tab.Contents) {
			var obj = tab.Contents[key];
			switch (obj.Type) {
				case 'Open':
				case 'Dropdown':
					c[key] = $('#' + key).val();
					break;

				case 'Multi':
					var codes = [];
					$('#config-' + key)
						.find(':checked')
						.each(function() {
							codes.push($(this).attr('id'));
						});
					c[key] = codes;
					break;
			}
		}
	}

	return c;
}

function PreviewPalette() {
	var value = $('#' + 'Palette').val();
	var survey_url = Products[active_project.ProductId].SurveyUrl + '?theme=' + value;
	var colors =
		Products[active_project.ProductId].Config.Layout.Contents.Palette.Options[value].Data;
	var o = [];

	var palette = [];
	for (var i = 0; i < colors.length; ++i)
		palette.push(
			`<td style="border: 2px solid white; height: 20px; width: 24px; background-color:${colors[i]}"></td>`
		);

	o.push(`
		<div>

			<!-- Palette + Preview Link -->
			<div style="margin-right: 20px">
				<table style="width: 300px; padding: 4px; border: 1px solid #c0c0c0;">
					<tr>
						${palette.join('')}
						<td style="width: 150px; padding-left: 20px">
							<a style="color: #666; font-size: smaller; text-decoration: none; " target=test_survey_window href="${survey_url}">
								Preview in new window →
							</a>
						</td>
					</tr>
				</table>
			</div>

			<!-- QR Code -->
			<div style="width: 140px; margin-top: 20px">
				<table style="width: 300px; padding: 4px; border: 1px solid #c0c0c0;">
					<tr>
						<td>
							<div id="qrcode-test-survey"></div>
						</td>
						<td style="width: 150px; color: #666; font-size: smaller; vertical-align: middle;">
							Preview on mobile
						</td>
					</tr>
				</table>
			</div>
		</div>
	`);

	$('#preview-Palette').html(o.join(''));

	// Update QR code placeholder
	$('#qrcode-test-survey').qrcode({
		render: 'table',
		width: 120,
		height: 120,
		text: survey_url,
	});
}

function PreviewCompanyWording() {
	var value = $('#' + 'CompanyWording').val();

	var statements = [
		'The $wording-company$ effectively measures the performance of core business activities',
		'Each unit of the $wording-company$ has explicit targets for its operating performance',
	];

	var o = [];
	o.push('<ul class=preview-text>');
	for (var i = 0; i < statements.length; ++i) {
		o.push(
			'<li>' +
				statements[i].replace(
					'$wording-company$',
					'<span class="highlight-word">' + value + '</span>'
				) +
				'</li>'
		);
	}

	o.push('</ul>');

	var x = $('#preview-CompanyWording');
	x.css('display', 'none');
	x.html(o.join(''));
	x.fadeIn();

	PreviewEmployeeWording();
}

function PreviewEmployeeWording() {
	var value = $('#' + 'EmployeeWording').val();
	var company_value = $('#' + 'CompanyWording').val();

	var statements = [
		'The $wording-company$’s $wording-employees$ are highly motivated',
		'Managers in the $wording-company$ find ways to make work more meaningful to their $wording-employees$',
	];

	var o = [];
	o.push('<ul class=preview-text>');
	for (var i = 0; i < statements.length; ++i) {
		o.push(
			'<li>' +
				statements[i]
					.replace(
						'$wording-employees$',
						'<span class="highlight-word">' + value + '</span>'
					)
					.replace('$wording-company$', company_value) +
				'</li>'
		);
	}

	o.push('</ul>');

	var x = $('#preview-EmployeeWording');
	x.css('display', 'none');
	x.html(o.join(''));
	x.fadeIn();
}

function DynamicText(s) {
	s = s.replace('$company$', $('#account-company-name').text());

	return s;
}

function RenderForm(target_id, form_id, definition) {
	// Load Existing Config Values
	var c_string = active_project.Config;
	var c = c_string == '' || c_string == null ? {} : JSON.parse(c_string);

	var o = [];

	o.push('<div id="form-' + form_id + '">');

	var scripts = [];

	var tabs = [];

	for (var tab_id in definition) {
		var tab = definition[tab_id];

		var tab_html = `
			<table>
				<tr>
					<td>
						<i class="${tab.Icon}" style="font-size: 25px; margin: 8px 12px 0 0; font-family: 'Font Awesome 6 Free' !important;">
						</i>
					</td>
					<td style="position:relative; top: -6px">
						<h6 style="font-weight: 400; color: inherit;">${tab.Label}</h6>
						<div style="font-size: x-small; font-weight: 400; color: inherit;">${tab.Sub}</div>
					</td>
				</tr>
			</table>
			`;

		tabs.push(
			'<div class="tile tab" style="font-size: 15px" id="tab-' +
				tab_id +
				'">' +
				tab_html +
				'</div>'
		);
		var contents = tab.Contents;

		// Tab
		o.push('<div class="tab-contents" id="tab-' + tab_id + '-contents">');

		if (tab.Description)
			o.push(
				'<div style="font-weight: 300; margin-bottom: 12px; color: #00a9f4; margin-right: 20px; font-size: smaller;">' +
					tab.Description +
					'</div>'
			);

		for (var key in contents) {
			var obj = contents[key];

			// Heading
			o.push(
				'<span style="position: relative; left: 30px; top: 12px; padding: 0px 10px; background-color: white; font-size: x-small; text-transform: uppercase; letter-spacing: 1.5px;">'
			);
			o.push(DynamicText(obj.Label));
			o.push('</span>');

			// Box
			o.push(
				'<div id="" style="font-weight: 300; color: black; padding: 20px 20px 0 20px; border: 1px solid #c0c0c0; margin-bottom: 30px;  margin-right: 20px; padding-bottom: 20px">'
			);

			// Description
			o.push(DynamicText(obj.Description));

			// Input
			var tmp = [];

			switch (obj.Type) {
				case 'Open':
					// Flex
					tmp.push('<div style="display: flex">');

					// Open
					tmp.push('<div style="min-width: 300px">');
					var value = c[key] != null ? c[key] : obj.DefaultValue;

					tmp.push(
						`<input value="${value}" id="${key}" style="min-width: 250px; padding: 10px; display: block; margin: 20px 0px 0px 0px; background-color: #F6FBFF; ;">`
					);
					// /Open

					tmp.push('</div>');
					// /Flex

					break;

				case 'Dropdown':
					// Flex
					tmp.push('<div style="display: flex">');

					// Dropdown
					tmp.push('<div style="min-width: 300px">');
					var value = c[key] != null ? c[key] : obj.DefaultValue;

					tmp.push(
						'<select id="' +
							key +
							'" style="min-width: 250px; display: block; margin: 20px 0px 0px 0px; background-color: #f0f0f0;">'
					);
					for (var option_code in obj.Options) {
						var option = obj.Options[option_code];
						tmp.push(
							'<option value="' +
								option_code +
								'" style=""' +
								(value == option_code ? ' selected=selected' : '') +
								'>' +
								option.Label +
								'</option>'
						);
					}
					tmp.push('</select>');
					tmp.push('</div>');
					// /Dropdown

					if (obj.HasPreview) {
						// Preview
						tmp.push(
							'<div style="padding: 20px 0 0 0" id="preview-' +
								key +
								'">' +
								'Preview' +
								'</div>'
						);
						// /Preview

						scripts.push('Preview' + key + '();');
						scripts.push(
							'$("#' + key + '").change(function(){Preview' + key + '();});'
						);
					}

					tmp.push('</div>');
					// /Flex
					break;

				case 'Multi':
					var values_map = {};
					if (c[key] != null) {
						// loop over array
						var codes = c[key];
						for (var i = 0; i < codes.length; ++i) values_map[codes[i]] = true;
					}
					tmp.push('<fieldset id="config-' + key + '">');
					for (var option_code in obj.Options) {
						var option = obj.Options[option_code];
						var value = option_code;
						tmp.push(
							`<div style="margin: 10px 0">
								<input ${
									values_map[value] ? ' checked ' : ''
								} type="checkbox" id="${value}" name="${key}" value="${value}">
								<label style="color: #000; font-size: smaller; position: relative; top: -2px" for="${value}">${DynamicText(
								option.Label
							)}</label>
							</div>`
						);
					}
					o.push('</fieldset>');
					break;
			}

			// Add input to main output
			o.push(tmp.join(''));

			o.push('</div>');
			// /Box
		}
		o.push('</div>');
		// /Tab
	}

	o.push('</div>');

	// Update form contents
	$('#' + target_id).html(
		`
		<div style="margin-top: 0; padding-top: 0;">

			<button class="action-button" id="save-active-project" type="button" style="float:right; height: 42px;;">Save & Exit</button>
			<div style="display: flex">
				${tabs.join('')}
			</div>

			<div class="tile" id="active-project-page" style="background-color: white; border: 0; padding: 20px 40px; margin: 2px;">
				<div id='active-project-form' style="margin: 20px 0 20px; max-height: 70vh; overflow-y: auto;">
					${o.join('')}
				</div>
			</div>
		</div>
	`
	);

	$('#save-active-project').click(UpdateProject);

	$('.tab').click(function() {
		// Tab Headers

		$('.tab').removeClass('active-tab');
		$(this).addClass('active-tab');

		// Tab Contents

		var tab_contents = $('.tab-contents');
		tab_contents.removeClass('active-tab-contents'); // hide all tab contents
		tab_contents.css('display', 'none');

		var id = $(this).attr('id'); // example: tab-Layout
		var content_id = id + '-contents'; // example: tab-Layout-contents

		$('#' + content_id).addClass('active-tab-contents'); // this will unhide the active tab contents

		$('.active-tab-contents').fadeIn();
	});

	$('.tab')
		.first()
		.click();

	eval(scripts.join(';'));
}

function ActivateProjectId(project_id) {
	for (var i = 0; i < projects.length; ++i) {
		if (projects[i].ProjectId == project_id) ActivateProject(projects[i]);
	}
}

function UpdateProjectName() {
	// todo
	var new_name = $('#project-info-name-edit').val();

	$('#project-info-name, #page-title').text(new_name);
	$('.page-title').text(new_name);
	active_project.DisplayName = new_name;

	PopulateProjectList();

	$('#project-info-name').show();
	$('#project-info-name-edit').hide();

	UpdateProject();
}

function UpdateOnScreenProjectName() {
	$('#active-project-name, .project-name').text(active_project.DisplayName);
}

function ActivateProject(project, prevent_redirect) {
	active_project = project;

	$('.project-data').val('');
	$('.modal-ui').hide();

	$('#project-response-count').text('--');
	$('#project-respondent-count').text('--');
	$('#project-invited-count').text('--');

	$('#respondent-emails').val('');

	// Turn on Menu Items
	$('.active-project-bullet').removeClass('active-project-bullet');

	UpdateOnScreenProjectName();
	//$('#active-project-name').text ( active_project.DisplayName );

	RenderForm('active-project-form', 'test', Products[active_project.ProductId].Config);

	// Temporary Code for Timeline
	var items = [
		{
			Time: 'Sep 2022',
			Text: 'Project Created',
			Subtext: active_project.DisplayName,
		},
		{Time: 'Oct 2022', Text: 'Estimated Launch', Subtext: 'TBD'},
		{Time: 'Nov 2022', Text: 'Data Collection Complete', Subtext: 'TDB'},
		{Time: 'Dec 2022', Text: 'Insights Delivered', Subtext: 'TDB'},
	];

	$('#project-timeline').html(GetTimeline(items));

	$('.project-tile').removeClass('active-project-tile');
	$('.project-tile-wrapper').removeClass('active-project-tile-wrapper');

	$('#project-tile-' + active_project.ProjectId).addClass('active-project-tile');
	$('#project-tile-wrapper-' + active_project.ProjectId).addClass('active-project-tile-wrapper');

	$('.page-title').text(active_project.DisplayName);

	if (!prevent_redirect) SimulateClick('#menuitem-active-project-info');

	LoadProjectRespondentCount();
}

function RefreshProjectData() {
	$('.cavani_tm_project_info').fadeOut();
	LoadProjectRespondentCount(true);
}

function LoadProjectResponseCount(bool_fadeIn) {
	var parameters = {
		Token: token,
		ProjectId: active_project.ProjectId,
		ProductId: active_project.ProductId,
	};

	Api('GetResponseCount', parameters, GetResponseCount_Success, Error);
}

function LoadProjectRespondentCount(bool_fadeIn) {
	LoadProjectResponseCount(bool_fadeIn);

	var parameters = {
		Token: token,
		ProjectId: active_project.ProjectId,
	};

	Api('GetRespondentAndInviteCounts', parameters, GetRespondentCounts_Success, Error);
}

function PageScaleUp() {
	var r = $('#ripple');
	r.css('background-image', 'url(' + r.attr('data-img-url') + ')');

	$('.author_image').velocity({width: '10%'}, {duration: 500, delay: 0});

	$('canvas').css('display', 'none');

	$('.main_content').velocity({width: '90%'}, {duration: 500, delay: 0});
}

function PageScaleDown() {
	$('canvas').css('display', 'unset');

	$('.author_image').velocity({width: '40%'}, {duration: 500, delay: 0});

	$('.main_content').velocity({width: '60%'}, {duration: 500, delay: 0});
}

function Signup() {
	$('#home-intro').hide();
	$('#login-form').hide();
	$('#signup-form').fadeIn();
}

function SimulateClick(x) {
	var item = $(x);
	item.trigger('mouseover');
	item.trigger('click');
}

function CloseDemo() {
	$('#demo').html('');
	$('#demo-container').fadeOut();
}

function ExpandCollapse(i) {
	var link = $('#expandable_' + i);
	var section = link.next();

	if (section.hasClass('hidden')) {
		link.text('Hide Details');
		section.slideDown();
	} else {
		link.text('Show Details');
		section.slideUp();
	}
	section.toggleClass('hidden');
}

function LoadProducts() {
	var o = [];

	var products_presentation = [];

	for (var key in Products) {
		var product = Products[key];

		// Metrics / Numbers

		var metric_presentation = [];
		for (var j = 0; j < product.Numbers.length; ++j) {
			var x = product.Numbers[j];
			var sub =
				x.Sub == null
					? ''
					: `<div style="line-height: 16px; margin-top: 4px">${x.Sub}</div>`;

			metric_presentation.push(`
				<div style="width: 28%; max-width: 250px; padding: 20px; margin-right: 30px; border: 0; background-color: #f9f9f9;">
					<h3 style="color: #00a9f4; font-weight: bold; font-family: Georgia !important">${x.Metric}</h3>
					<h6 style="font-weight: 300; color: #00a9f4; margin-bottom: 12px;">${x.Label}</h6>
					${sub}
				</div>
			`);
		}

		// Demo Links
		var demo_presentation = [];
		if (product.Demos != null) {
			var demos = [];
			for (var j = 0; j < product.Demos.length; ++j) {
				var demo = product.Demos[j];
				demos.push(`
					<div style="padding: 0px; margin: 0px; border: 0px; margin-right: 20px">
						<button class=demo id="demo-button-${key}-${j}" type="button" style="font-weight: 300; margin-top: 20px; height: 40px; border: 0;background-color: #00a9f4; padding: 20px; color: white; padding: 6px 38px;">
							${demo.Label}
						</button>
					</div>
				`);
			}

			demo_presentation.push(`
				<h5 style="font-weight: 300; margin-top: 40px">Demos</h5>
				<div id="demo-section-${key}" style="display: flex; flex-wrap: wrap;">
					${demos.join('')}
				</div>
			`);
		}

		// Product Description

		products_presentation.push(`


			<!-- Product ${key} -->

			<div style="padding: 20px 40px; margin-bottom: 40px; background-color: white; width: 100%">

				<!-- Add Product Button -->
				<button class="action-button round-button add-project-button" id="add-project-button-${key}" type=button>
					+
				</button>

				<h4 style="margin-bottom: 20px">${product.Name}</h4>
				<h6 style="margin-bottom: 20px; font-weight: 300">${product.TagLine}</h6>
				<div style="display: flex; flex-wrap: wrap; margin-top: 20px;">
					${metric_presentation.join('')}
				</div>

				<!-- Show Details Link -->

				<div style="margin-top: 10px">

					<a class="details-link" id="expandable_${key}" href="javascript:ExpandCollapse('${key}');" >Show Details</a>

					<!-- Expand/Collapse content -->

					<div class=hidden style="display: none">

						${demo_presentation.join('')}

						<!-- Solution Description -->

						<h5 style="font-weight: 300; margin-top: 40px">Description</h5>
						<div id="more_${key}" style="display: flex; flex-wrap: wrap; margin-top: 20px">
							<div style="width: 40%">
								<img style="margin-bottom: 20px; filter: grayscale(0.5);" src="${product.Icons.Thumbnail}">
							</div>
							<div style="width: 50%; margin-left: 40px">
								<div style="line-height: 20px; font-weight: 300">
									${product.Description}
								</div>
							</div>
						</div>

						<!-- End Solution Description -->

					</div>

					<!-- End Expand/Collapse content -->

				</div>

				<!-- End Show Details Link -->

			</div>

			<!-- End Product ${key} -->

		`);
	}

	o.push(`
		<div style="display:flex; flex-wrap: wrap">
			${products_presentation.join('')}
		</div>
	`);

	$('#product-list').html(o.join(''));

	// Click Handler: Filters & Comparators

	$('.add-project-button').click(function() {
		if (token == null) {
			new Notify('Error', 'You need to log in first.', 'error', {
				autoClose: false,
			});
		} else {
			var id = $(this).attr('id');
			var product_id = id.split('-').pop();

			var parameters = {
				Token: token,
				ProductId: product_id,
			};

			$('#cavani_tm_projects').fadeOut();
			Api('AddProject', parameters, AddProject_Success, Error);
		}
	});

	$('.demo').click(function(e) {
		// Add Content to #demo

		var id = $(this).attr('id'); // demo-1-2 (product 1, demo 2)
		var parts = id.split('-');
		var demo_idx = parseInt(parts.pop());
		var product_idx = parseInt(parts.pop());

		var url = Products[product_idx].Demos[demo_idx].Url;

		var o = [];
		o.push(
			'<iframe style="scale: 0.8; background-color: white; width: 100vw; height: 100vh;" src="' +
				url +
				'">',
			'</iframe>'
		);

		$('#demo').html(o.join(''));

		$('#demo-container').fadeIn();
		e.stopPropagation();
	});
}

function EditProfile() {
	$('#account-summary').hide();
	$('#edit-form').fadeIn();
	$('#edit-link').fadeOut();
}

function UpdateProject_Success(o) {
	$('.cavani_tm_active_project').fadeIn();
	SimulateClick('#menuitem-active-project-info');
}

function UpdateProject() {
	$('.cavani_tm_active_project').fadeOut();

	var cfg_stringified = JSON.stringify(GetConfig());
	active_project.Config = cfg_stringified;

	var parameters = {
		Token: token,
		Id: active_project.ProjectId,
		DisplayName: active_project.DisplayName,
		Config: cfg_stringified,
	};

	Api('UpdateProject', parameters, UpdateProject_Success, Error);
}

function Login(userid, pw) {
	var parameters = {
		Id: userid,
		Password: pw,
	};

	Api('Login', parameters, Login_Success, Error);
}

function PopulateProjectList(activate_newest_project) {
	var records = projects;
	var o = [];

	// Project Tiles
	o.push('<div style="display: flex; flex-direction: row; flex-wrap: wrap;">');

	records = records.reverse();

	for (var i = 0; i < records.length; ++i) {
		var record = records[i];
		var created_date = new Date(record.CreatedDate);

		created_date = new Date(created_date.getTime());

		o.push(
			'<div class="project-tile-wrapper" id="project-tile-wrapper-' + record.ProjectId + '">'
		);
		o.push(
			'<div class="project-tile" id="project-tile-' +
				record.ProjectId +
				'" onclick="javascript:ActivateProjectId(' +
				record.ProjectId +
				');" class=project>'
		);

		o.push(
			'<div class="project-created-date" style="float: right">' +
				created_date.toISOString().split('T')[0] +
				'</div>'
		);
		o.push(
			'<div class="project-image" style="background-image: url(' +
				Products[record.ProductId].Icons.Main +
				')"></div>'
		);
		o.push('<div class="project-display-name">' + record.DisplayName + '</div>');
		o.push(
			'<div style="width:80px;margin-left: 82.5px; margin-top: 10px; border-top: 1px solid #e0e0e0;"></div>'
		);
		o.push('<div class="project-type">' + Products[record.ProductId].Name + '</div>');

		o.push('</div>');
		o.push('</div>');
	}

	o.push('</div>');
	// /Project Tiles

	var yp = $('#your-projects');
	yp.html(o.join(''));
	yp.fadeIn();

	$('#project-count').text('(' + records.length + ')');

	if (activate_newest_project && projects.length > 0) ActivateProject(projects[0], true);
	// if we just added a new one (will be first in list)
	else if (active_project != null) ActivateProject(active_project, true); // to highlight the active one
}

/*
function old_PopulateProjectList() {

var records = projects;
var o = [];
o.push ( '<table border=1>');

o.push ( `
    <thead>
        <td class="data-cell header-cell">ID</td>
        <td class="data-cell header-cell">Project Name</td>
        <td class="data-cell header-cell">Type</td>
        <td class="data-cell header-cell">Created Date</td>
        <td class="data-cell header-cell">Phase</td>
    </thead>
`);

for (var i=0; i<records.length; ++i) {
    var record = records[i];
    var created_date = new Date ( record.CreatedDate );

    created_date = new Date(created_date.getTime());

    o.push (`
        <tr>
            <td class=data-cell>${record.ProjectId}</td>
            <td class=data-cell><a href="javascript:ActivateProject(${record.ProjectId})">${record.DisplayName}</a></td>
            <td class=data-cell>${Products[record.ProductId].Name}</td>
            <td class=data-cell>${created_date.toISOString().split('T')[0]}</td>
            <td class=data-cell>${"Design"}</td>
        </tr>
    `);
}
o.push ( '</table>' );

var yp = $('#your-projects');
yp.html ( o.join('') );
yp.fadeIn();

$('#add-first-project').text (
    (records.length == 0)
        ? 'Ideas For Your First Project'
        : 'Explore More Solutions'
);
}
*/

function LoadProjects(activate_newest_project) {
	var parameters = {
		Token: token,
	};

	Api('GetProjects', parameters, GetProjects_Success, Error);
}

function ShowPrivateMenu() {
	$('.private-menu-bullet').css('display', 'unset');
	$('.hide-after-login-bullet').css('display', 'none');
}

function HidePrivateMenu() {
	$('.private-menu-bullet, .hide-after-login-bullet').removeAttr('style');

	//$('.private-menu-bullet').css('display', 'none');
	//$('').css('display', 'unset');
}

function LogOut() {
	// Clear global variables
	token = null;
	projects = null;
	active_project = null;
	user = null;

	// Clear session specific text and input
	$('.session-text').text('');
	$('.session-input').val('');

	HidePrivateMenu();
	PageScaleDown();

	SimulateClick('#menuitem-home');

	// Clear Data
	$('#survey-url').val('');
	$('#your-projects').html('');
	$('#login-userid').val('');
	$('#login-password').val('');

	// Show / Hide
	$('#logged-in').hide();
	$('#signup-form').hide();
	$('#home-intro').fadeIn();
	$('#login-form').fadeIn();
	$('.cavani_tm_home').fadeIn();

	$('.page-title').text('Employee Listening Hub');
}

function ClearLoginForm() {
	$('#login-userid').val('');
	$('#login-pw').val('');
	$('#login-error-message').text('');
}

function ClearSignupForm() {
	$('#signup-userid').val('');
	$('#signup-pw').val('');
	$('#signup-email').val('');
	$('#signup-name').val('');
	$('#signup-company').val('');
	$('#signup-error-message').text('');
}

// PowerPoint generation

function DownloadPowerPoint_OHI(data) {
	var quotes = data;

	// 1. Create a Presentation
	let pptx = new PptxGenJS();

	var logo_ratio = 1258 / 2000;
	var logo_width = 1.5; // inches

	var bg_ratio = 1440 / 2560;
	bg_width = 10;

	var now = new Date();

	pptx.defineSlideMaster({
		title: 'Master1',
		background: {
			color: 'FFFFFF',
		},

		objects: [
			{
				image: {
					path: 'mckinsey_logo.jpg',
					x: 0.4,
					y: 0.15,
					w: logo_width,
					h: logo_width * logo_ratio,
				},
			},
			{
				image: {
					path: 'image2.png',
					x: '0%',
					y: 0,
					w: bg_width,
					h: bg_width * bg_ratio,
				},
			},
		],
	});

	var face_width = 5.625;
	var face_ratio = 1;

	var quote_width = 0.5;
	var quote_ratio = 600 / 800;

	pptx.defineSlideMaster({
		title: 'Face',
		background: {
			color: 'FFFFFF',
		},

		objects: [
			{
				image: {
					path: 'mckinsey_logo.jpg',
					x: 0.4,
					y: 0.15,
					w: logo_width,
					h: logo_width * logo_ratio,
				},
			},
			{
				image: {
					path: 'quote.png',
					x: 0.4,
					y: 1.5,
					w: quote_width,
					h: quote_ratio * logo_ratio,
				},
			},
			{
				image: {
					path: 'face.jpg',
					x: '44%',
					y: 0,
					w: face_width,
					h: face_width * face_ratio,
				},
			},
		],
	});

	// 2. Add a Slide to the presentation
	pptx.addSection({title: 'Cover Page'});
	let slide = pptx.addSlide({
		masterName: 'Master1',
		sectionTitle: 'Section Title',
	});

	// 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
	slide.addText(active_project.DisplayName, {
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

	slide.addText(now + '', {
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

	for (var i = 0; i < quotes.length; ++i) {
		let quote_slide = pptx.addSlide({
			masterName: 'Face',
			sectionTitle: 'Quotes',
		});

		quote_slide.addText(quotes[i], {
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
		fileName: active_project.DisplayName.replace('.', ' ') + '.pptx',
	});
}

function DownloadPowerPoint_WeeklyAttitudePulse(data) {
	var quotes = data;

	// 1. Create a Presentation
	let pptx = new PptxGenJS();

	var logo_ratio = 1258 / 2000;
	var logo_width = 1.5; // inches

	var bg_ratio = 1440 / 2560;
	bg_width = 10;

	var now = new Date();

	pptx.defineSlideMaster({
		title: 'Master1',
		background: {
			color: 'FFFFFF',
		},

		objects: [
			{
				image: {
					path: 'mckinsey_logo.jpg',
					x: 0.4,
					y: 0.15,
					w: logo_width,
					h: logo_width * logo_ratio,
				},
			},
			{
				image: {
					path: 'image2.png',
					x: '0%',
					y: 0,
					w: bg_width,
					h: bg_width * bg_ratio,
				},
			},
		],
	});

	var face_width = 5.625;
	var face_ratio = 1;

	var quote_width = 0.5;
	var quote_ratio = 600 / 800;

	pptx.defineSlideMaster({
		title: 'Face',
		background: {
			color: 'FFFFFF',
		},

		objects: [
			{
				image: {
					path: 'mckinsey_logo.jpg',
					x: 0.4,
					y: 0.15,
					w: logo_width,
					h: logo_width * logo_ratio,
				},
			},
			{
				image: {
					path: 'quote.png',
					x: 0.4,
					y: 1.5,
					w: quote_width,
					h: quote_ratio * logo_ratio,
				},
			},
			{
				image: {
					path: 'pulse.jpg',
					x: '44%',
					y: 0,
					w: face_width,
					h: face_width * face_ratio,
				},
			},
		],
	});

	// 2. Add a Slide to the presentation
	pptx.addSection({title: 'Cover Page'});
	let slide = pptx.addSlide({
		masterName: 'Master1',
		sectionTitle: 'Section Title',
	});

	// 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
	slide.addText(active_project.DisplayName, {
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

	slide.addText(now + '', {
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

	for (var i = 0; i < quotes.length; ++i) {
		let quote_slide = pptx.addSlide({
			masterName: 'Face',
			sectionTitle: 'Quotes',
		});

		quote_slide.addText(quotes[i], {
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
		fileName: active_project.DisplayName.replace('.', ' ') + '.pptx',
	});
}

function DownloadPowerPoint() {
	var parameters = {
		Token: token,
		ProjectId: active_project.ProjectId,
	};

	Api('GetResponseData', parameters, GetResponseData_Success, Error);
}

// API stuff

function Api(fn, parameters, fn_success, fn_error) {
	var form_data = {
		fn: fn,
		params: JSON.stringify(parameters),
	};

	$.ajax({
		url: URL.Api,
		type: 'POST',
		data: form_data,
		success: function(data, textStatus, jqXHR) {
			var o = JSON.parse(data);

			if (o.Status == 'OK') fn_success(o);
			else fn_error(o); // error handled in API
		},
		error: function(jqXHR, textStatus, errorThrown) {
			new Notify('Error', errorThrown, 'error', {autoClose: true});
		},
	});
}

function Error(o) {
	new Notify('Error', o.Data, 'error', {autoClose: true});
}

function AddProject_Success(o) {
	LoadProjects(true); // refresh list and activate the newly added one
	//SimulateClick('#menuitem-projects');
}

function AddRespondents_Success(o) {
	var data = o.Data;

	LoadProjectRespondentCount();
	$('#respondent-emails').val('');

	var upload_button = $('#upload-respondents-button');
	upload_button.prop('disabled', true);
	upload_button.addClass('disabled-button');
	upload_button.text('Upload emails');

	var validate_button = $('#validate-respondents-button');
	validate_button.prop('disabled', false);
	validate_button.removeClass('disabled-button');

	new Notify('Success', data.RespondentCount + ' email(s) successfully uploaded', 'success', {
		autoClose: true,
	});
	$('#upload-respondents-ui').slideUp();
}

function EditAccount_Success(o) {
	var data = o.Data;

	user = data;

	ShowPrivateMenu();
	PageScaleUp();

	ClearLoginForm();
	ClearSignupForm();

	var o = [];

	$('#account-company-name').text(data.Company);
	$('#account-user-display-name').text(data.UserDisplayName);
	$('#account-user-email').text(data.Email);

	$('#login-status').html(o.join(''));

	$('#edit-name').val(data.UserDisplayName);
	$('#edit-email').val(data.Email);
	$('#edit-company').val(data.Company);

	$('#survey-url').val(data.Url);

	// Show/hide logic
	$('.cavani_tm_home').hide();
	$('#logged-in').fadeIn();

	$('#edit-form').hide();

	$('#account-summary').fadeIn();
	$('#edit-link').fadeIn();

	LoadProjects();
}

function GetProjects_Success(o) {
	projects = o.Data; // global variable

	// Project List Title
	$('#project-page-title').html(
		projects.length == 0 ? `Welcome, ${user.UserDisplayName}` : `Your Projects`
	);

	$('#project-list-title').css('display', projects.length == 0 ? 'none' : 'unset');

	// Project List Contents
	PopulateProjectList(false);

	// Project List Message
	switch (projects.length) {
		case 0:
			$('#project-list-welcome-msg').html(`
			First of all, thank you for signing up!
			<P style="margin-top: 20px">
			While this portal allows you do to all your own employee research, it doesn't mean you have to. Your McKinsey team is just a click away, and always happy to assist:

			<ul style="margin-top: 20px; line-height: 24px; background-color: white; border: 0; color: black; padding: 20px 40px;">
				<li>If you want someone to talk you through how to use the portal.
				<li>If you're feeling scared about deploying your first research project, and would like a second pair of eyes.
				<li>If you need McKinsey to be in the driver's seat for a bit.
				<li>If you need help interpreting the results of your research.
				<li>If you just want to chat.
			</ul>
			<p style="
				margin-top: 20px;
			">Sincerely,</p>
			<div style="display: flex">
				<div style="
					background-image: url(https://media-exp1.licdn.com/dms/image/C5603AQGdviMnBW44Ng/profile-displayphoto-shrink_100_100/0/1516371918049?e=1669248000&amp;v=beta&amp;t=lDh_vE8aC9GYzlojUdoMte8pUhe9k38tM-290e9e7HA);
					background-repeat: no-repeat;
					background-size: contain;
					height: 80px;
					width: 80px;
					border-radius: 50%;
					margin: 10px 20px 0 0;
				">
				</div>
				<div style="padding-top: 20px">
					<div class=signature>Adam Clover</div>
					<img style="width: 85px;" class="partner-logo" src="https://www.freelogovectors.net/wp-content/uploads/2022/06/mckinsey-logo-freelogovectors.net_.png">
				</div>
			</div>

			<div class="signature" style="position: absolute; top: 110px; right: 60px;width: 140px;line-height: 24px; text-align: right;">↑<br><br>${
				user.UserDisplayName.split(' ')[0]
			} - add your first project here</div>

			`);
			break;

		case 1:
			$('#project-list-welcome-msg').html(
				`Let's get that first project rolling, ${user.UserDisplayName.split(' ')[0]}!`
			);
			break;

		default:
			$('#project-list-welcome-msg').html(
				`Select an existing research project, or add a new.`
			);
	}

	if (projects.length == 1) {
		ActivateProject(projects[0], true); // if we have exactly one project, activate it
	}

	SimulateClick('#menuitem-projects');
	$('#cavani_tm_projects').fadeIn();
}

function GetResponseCount_Success(o) {
	$('#project-response-count').text(o.Data);
}

function GetResponseData_Success(o) {
	var response_data = o.Data;

	switch (active_project.ProductId) {
		case '1': // OHI
			DownloadPowerPoint_OHI(response_data);
			break;

		case '3': // Weekly Pulse
			DownloadPowerPoint_WeeklyAttitudePulse(response_data);
			break;
	}
}

function GetRespondentCounts_Success(o) {
	$('.cavani_tm_project_info').fadeIn();

	var respondent_count = o.Data.RespondentCount;
	var invite_count = o.Data.InviteCount;

	$('#project-respondent-count').text(respondent_count);
	$('#project-invited-count').text(invite_count);

	active_project.RespondentCount = respondent_count;
	active_project.InviteCount = invite_count;
}

function LoadUserList_Success(o) {
	var users = o.Data;

	var o = [];
	o.push('<ol>');
	for (var i = 0; i < users.length; ++i) {
		o.push('<li>' + users[i].UserId + ' (' + users[i].UserDisplayName + ')');
	}
	o.push('</ol>');

	var o = [];
	o.push('<table border=1>');

	o.push(`
		<thead>
			<td class="data-cell header-cell">UserID</td>
			<td class="data-cell header-cell">Full Name</td>
			<td class="data-cell header-cell">Email</td>
			<td class="data-cell header-cell">Company</td>
		</thead>
	`);

	for (var i = 0; i < users.length; ++i) {
		var user = users[i];

		o.push(`
			<tr>
				<td class=data-cell><a href="javascript:alert('Coming Soon');">${user.UserId.toLowerCase()}</a></td>
				<td class=data-cell>${user.DisplayName}</td>
				<td class=data-cell>${user.Email}</td>
				<td class=data-cell>${user.Company}</td>
			</tr>
		`);
	}
	o.push('</table>');

	$('#system-users').html(o.join(''));
}

function Login_Success(o) {
	token = o.Token;
	EditAccount_Success(o);
	SimulateClick('#menuitem-projects');
}

function ReviewRespondents_Success(o) {
	var records = o.Data;

	var o = [];
	for (var i = 0; i < records.length; ++i) {
		o.push(
			i +
				1 +
				'. ' +
				records[i].Email +
				(records[i].EmailCount == null
					? ''
					: ' (Email Count: ' + records[i].EmailCount + ')')
		);
	}

	$('#review-respondent-emails').val(o.join('\n'));
}

function SendInvitations_Success(o) {
	new Notify('Success', o.Data.EmailCount + ' email invitation(s) sent', 'success', {
		autoClose: true,
	});
	LoadProjectRespondentCount();
}

function Signup_Success(o) {
	new Notify('Success', 'Account succesfully created -- you may now log in', 'success', {
		autoClose: true,
	});
	LogOut();
}

function PartnerLogo() {
	return PartnerData().LogoUrl;
}

function PartnerData() {
	const params = new URLSearchParams(window.location.search);
	var partner_id = params.get('partner');
	if (partner_id == '' || partner_id == null) partner_id = 'mck'; // default
	var partner_data = Partners[partner_id];

	return partner_data;
}

$(document).ready(function() {
	LoadProducts();

	LoadHelp();

	// Click Handlers

	$('#edit-save-button').click(function() {
		var parameters = {
			Token: token,
			Email: $('#edit-email').val(),
			Name: $('#edit-name').val(),
			Company: $('#edit-company').val(),
			Url: $('#survey-url').val(),
		};

		Api('UpdateUser', parameters, EditAccount_Success, Error);
	});

	$('#edit-cancel-button').click(function() {
		$('#account-summary').fadeIn();
		$('#edit-form').hide();
		$('#edit-link').fadeIn();
	});

	$('#signup-button').click(function() {
		var parameters = {
			Id: $('#signup-userid').val(),
			Email: $('#signup-email').val(),
			Password: $('#signup-pw').val(),
			Name: $('#signup-name').val(),
			Company: $('#signup-company').val(),
		};

		Api('AddUser', parameters, Signup_Success, Error);
	});

	$('#signup-cancel-button').click(function() {
		$('#signup-userid').val('');
		$('#signup-pw').val('');
		$('#signup-email').val('');
		$('#signup-name').val('');
		$('#signup-company').val('');

		$('#signup-form').hide();
		$('#home-intro').fadeIn();
		$('#login-form').fadeIn();
	});

	$('#login-button').click(function() {
		var userid = $('#login-userid').val();
		var pw = $('#login-pw').val();
		Login(userid, pw);
	});

	$('#logout-button').click(function() {
		LogOut();
	});

	$('#menuitem-users').click(function() {
		var parameters = {
			Token: token,
		};

		Api('GetUsers', parameters, LoadUserList_Success, Error);
	});

	$('#respondent-emails').keydown(function(e) {
		var upload_button = $('#upload-respondents-button');
		upload_button.prop('disabled', true);
		upload_button.addClass('disabled-button');
		upload_button.text('Upload emails');

		var validate_button = $('#validate-respondents-button');
		validate_button.prop('disabled', false);
		validate_button.removeClass('disabled-button');
	});

	$('#validate-respondents-button').click(function() {
		var id = '#respondent-emails';
		var input_text = $(id).val();
		var emails = input_text
			.toLowerCase()
			.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
		$(id).val(emails == null ? '' : emails.sort().join('\n'));

		if (emails == null) {
			new Notify('Error', 'No valid email addresses found in input.', 'error', {
				autoClose: true,
			});
		} else {
			var upload_button = $('#upload-respondents-button');
			upload_button.prop('disabled', false);
			upload_button.removeClass('disabled-button');
			upload_button.text(
				'Upload ' + emails.length + ' email' + (emails.length > 1 ? 's' : '')
			);

			var validate_button = $('#validate-respondents-button');
			validate_button.prop('disabled', true);
			validate_button.addClass('disabled-button');
		}
	});

	$('#upload-respondents-button').click(function() {
		var input_text = $('#respondent-emails').val();
		var emails = input_text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi).sort();

		var parameters = {
			Token: token,
			ProjectId: active_project.ProjectId,
			Respondents: emails, // array
		};

		Api('AddRespondents', parameters, AddRespondents_Success, Error);
	});

	$('#close-respondents-upload-button').click(function() {
		$('#upload-respondents-ui').slideUp();
	});

	$('#add-respondents-launch-button').click(function() {
		$('.modal-ui').hide();
		$('#upload-respondents-ui').slideDown();
	});

	$('#close-respondents-review-button').click(function() {
		$('#review-respondent-emails').val('');
		$('#review-respondents-ui').slideUp();
	});

	$('#review-emails-button').click(function() {
		$('#review-respondent-emails').val('Loading...');
		$('.modal-ui').hide();
		$('#review-respondents-ui').slideDown();

		var parameters = {
			Token: token,
			ProjectId: active_project.ProjectId,
		};

		Api('GetCurrentProjectRespondentData', parameters, ReviewRespondents_Success, Error);
	});

	$('#schedule-emails-button').click(function() {
		var parameters = {
			Token: token,
			ProjectId: active_project.ProjectId,
			SurveyUrl: Products[active_project.ProductId].SurveyUrl,
			EmailSubject: 'Feedback Requested: ' + active_project.DisplayName,
		};

		Api('SendLinkToNewSurveyRespondents', parameters, SendInvitations_Success, Error);
	});

	$('#download-report-button').click(function() {
		DownloadPowerPoint();
	});

	$('#project-info-name-edit').focusout(UpdateProjectName);

	$('#project-info-name-edit').change(UpdateProjectName);

	$('#project-info-name').click(function() {
		$('#project-info-name-edit').val($('#project-info-name').text());

		$('#project-info-name').hide();
		var edit = $('#project-info-name-edit');
		edit.show();
		edit.focus();
	});

	// for testing
	if (document.location.href.split('//localhost/').length > 1) {
		Login('espen', 'pw');
	}
});

// Research Partner Update

var pd = PartnerData();

var img_url = pd.MainImgUrl;
$('#ripple').attr('data-img-url', img_url);
$('.partner-logo').attr('src', pd.LogoUrl);
