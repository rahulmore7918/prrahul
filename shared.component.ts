import { Component, OnInit } from '@angular/core';
interface SnapshotSelector {
    "first": { "icon": string, "name": string, "type": string }[],
    "second": { "name": string, "type": string }[],
    "third": { "icon": string, "name": string, "type": string }[]
}
@Component({
    selector: 'app-shared',
    templateUrl: './shared.component.html',
    styleUrls: ['./shared.component.scss'],
})
export class SharedComponent implements OnInit {
    currentTab: string;
    structure: string[] = ['flat', 'hierarchical'];
    otherTheme: boolean = false;
    selected = 'Create Date';
    page = 1;
    pageSize = 4;
    views: { name: string, tooltip: string }[] = [{ name: 'view_module', tooltip: "" }, { name: 'view_module', tooltip: "view_list" }];
    repositoryViewOptions: string[] = ['Create Date', 'Alphabetically', 'Last Scanned', 'Rating', 'Size'];
    data: any = [
        { name: 'class', description: 'Custom class to be added' },
        { name: 'items', description: 'Array of items' },
        { name: 'callFunction', description: 'Callback function to be called on click' },
    ];
    foods: any[] = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];
    displayedColumns: string[] = ['name', 'description'];
    primaryButton: any[] = [{ 'icon': '', 'class': 'mb-3 em-btn-primary btn-sm ', 'name': 'Small Button' },
    { 'icon': '', 'color': 'warn', 'class': ' mb-3 em-btn-primary', 'name': 'Default Button' },
    { 'icon': '', 'class': 'mb-3 em-btn-primary btn-lg ', 'name': 'Large Button' },
    ];
    primaryButtonWithIcons: any[] = [{ 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-primary btn-sm ', 'name': 'Small Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-primary', 'name': 'Default Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-primary btn-lg ', 'name': 'Large Button' },
    ];

    secondaryButton: any[] = [{ 'icon': '', 'class': 'mb-3 em-btn-secondary btn-sm ', 'name': 'Small Button' },
    { 'icon': '', 'color': 'warn', 'class': ' mb-3 em-btn-secondary', 'name': 'Default Button' },
    { 'icon': '', 'class': 'mb-3 em-btn-secondary btn-lg ', 'name': 'Large Button' },
    ];
    secondaryButtonWithIcons: any[] = [{ 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-secondary btn-sm ', 'name': 'Small Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-secondary', 'name': 'Default Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-secondary btn-lg ', 'name': 'Large Button' },
    ];

    whiteButton: any[] = [{ 'icon': '', 'class': 'mb-3 em-btn-white btn-sm ', 'name': 'Small Button' },
    { 'icon': '', 'color': 'warn', 'class': ' mb-3 em-btn-white', 'name': 'Default Button' },
    { 'icon': '', 'class': 'mb-3 em-btn-white btn-lg ', 'name': 'Large Button' },
    ];
    whiteButtonWithIcons: any[] = [{ 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-white btn-sm ', 'name': 'Small Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-white', 'name': 'Default Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-white btn-lg ', 'name': 'Large Button' },
    ];

    lightButton: any[] = [{ 'icon': '', 'class': 'mb-3 em-btn-light btn-sm ', 'name': 'Small Button' },
    { 'icon': '', 'color': 'warn', 'class': ' mb-3 em-btn-light', 'name': 'Default Button' },
    { 'icon': '', 'class': 'mb-3 em-btn-light btn-lg ', 'name': 'Large Button' },
    ];
    lightButtonWithIcons: any[] = [{ 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-light btn-sm ', 'name': 'Small Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-light', 'name': 'Default Button' },
    { 'icon': 'ic-brand-github', 'class': 'mb-3 em-btn-light btn-lg ', 'name': 'Large Button' },
    ];
    snapItems: SnapshotSelector = {
        "first": [{ "icon": "ic-branch", "name": "Branches", "type": "icon" }, { "icon": "ic-trend", "name": "Tags", "type": "icon" }],
        "second": [{ "name": "master", "type": "string" }, { "name": "development", "type": "string" }],
        "third": [{ "icon": "ic-clock", "name": "12.30.009 ", "type": "icon-string" }, { "icon": "ic-clock", "name": "12.90.009 ", "type": "icon-string" }]
    }
    checkboxOption: any[] = [
        { name: 'Default', checked: false, disabled: "false" },
        { name: 'Selected', checked: true, disabled: "false" },
        { name: 'Disabled', checked: false, disabled: "true" },
        { name: 'Selected Disabled', checked: true, disabled: "true" }];

    //dynamic Radion Options
    radioOption: any[] = [{ name: 'Default', checked: 'false', disabled: "false" }, { name: 'Selected', checked: 'true', disabled: "false" }, { name: 'Disabled', checked: 'false', disabled: "true" }, { name: 'Selected Disabled', checked: 'true', disabled: "true" }];

    repositoryOptions = ['Scan repository', 'Scan history', 'Snapshots', 'Scan configuration', 'Code checkers configuration', 'Download repository configuration', 'Quality gate profile', 'Issue tracker integration', 'Edit repository', 'Manage level and repository', 'Delete repository'];
    dropdownList = [
        { item_id: 1, item_text: 'Javascript' },
        { item_id: 2, item_text: 'Java' },
        { item_id: 3, item_text: 'C++' },
        { item_id: 4, item_text: 'Angular' },
        { item_id: 5, item_text: 'Python' }
    ];
    dropdownListItem = ['Javascript', 'Java', 'C++', 'Angular', 'Python'];

    scanOptions: { name: string, optionType: string }[] = [
        { name: 'Scan', optionType: "click" },
        { name: 'Custom Scan', optionType: "modal" },
        { name: 'Scan Scheduler', optionType: "link" }
    ];
    dataSource = this.data;
    myDate = new Date();

    //bar trend graph data inputs
    snapshotLabel: Array<Object> = ['snapshot 1', 'snapshot 2', 'snapshot 3', ' snapshot 4', 'snapshot 5', 'snapshot 6', 'snapshot 7'];
    snapshotRatings = [2.16, 2.30, 2.40];

    // pie chart
    position = "center";
    pieChartData: Array<Object> = [
        {
            "name": "No Duplication",
            "displayName": "No Duplication",
            "value": 158787,
            color: '#00AE2C',
            label: {
                show: false
            }

        }, {
            "name": "DLOC",
            "displayName": "DLOC",
            "value": 63167,
            color: '#D21111',

        }];

    //bar graph data
    barGraphData: Array<Object> = [{
        name: 'Accuracy',
        value: 29
    },
    {
        name: 'Maintainability',
        value: 333
    },
    {
        name: 'Robustness',
        value: 10
    },
    {
        name: 'Understandability',
        value: 121
    },
    {
        name: 'Portability',
        value: 232
    },
    {
        name: 'Efficiency',
        value: 42
    },
    {
        name: 'Performance',
        value: 54
    },
    {
        name: 'Reusability',
        value: 123
    }];

    tabData: any[] = [{ 'href': 'home', 'title': 'Antipattern', 'class': 'active' },
    { 'href': 'menu1', 'title': 'Code Issues', 'class': '' }, { 'href': 'menu2', 'title': 'Vulnerability', 'class': '' }
    ];

    //line trend graph
    lineTrendGraphTimeline: Array<string> = ['2 Dec 2019', '29 Jan 2020', '14 Feb 2020', '30 April 2020', '21 May 2020', '4 June 2020', '24 Aug 2020'];
    lineTrendGraphData: Array<Object> = [{
        data: [3, 22, 13, 14, 15, 5, 20],
        color: '#C294F8',
        name: 'Code quality rating',
        stack: 'codeissuestack',
        areaStyle: { color: '#F4B44D' },
        lineStyle: {
            width: 0,
            color: '#F4B44D'
        }, itemStyle: {
            color: '#F4B44D'
        }
    }, {
        data: [10, 32, 15, 14, 35, 25, 21],
        color: '#7ADBC0',
        name: 'Overall rating',
        stack: 'codeissuestack',
        areaStyle: { color: '#CB6464' },
        lineStyle: {
            width: 0
        }, itemStyle: {
            color: '#CB6464'
        }
    }];
    lineTrendGraphMin: Number = null;
    lineTrendGraphMax: Number = null;
    treeItems: Object = {
        Groceries: {
            'Almond Meal flour': null,
            'Organic eggs': null,
            'Protein Powder': null,
            Fruits: {
                Apple: null,
                Berries: ['Blueberry', 'Raspberry'],
                Orange: null
            }
        },
        Reminders: [
            'Cook dinner',
            'Read the Material Design spec',
            'Upgrade Application to Angular'
        ]
    };
    heatMapData: object[] = [];
    autoCompleteLabel: string = 'state';
    autoCompleteList = [
        {
            authorName: 'Arkansas',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
        },
        {
            authorName: 'California',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
        },
        {
            authorName: 'Florida',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
        },
        {
            authorName: 'Texas',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
        }
    ];
    constructor() { }

    ngOnInit(): void {
        this.currentTab = 'home';
    }
    changeTheme() {
        this.otherTheme = !this.otherTheme;
    }
    //Tab change
    onTabChange(tab) {
        this.currentTab = tab.target.id;
    }
    onChange(event: { name: string, optionType: string }) {
    }

    onSnapshotChange(event: any): void {
    }
    onButtonClicked(event) {
        console.log("button toggle clicked");
    }
}
