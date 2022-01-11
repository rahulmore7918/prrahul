import {
    CommonModule,
    DecimalPipe
} from '@angular/common';
import { NgModule } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import * as echarts from 'echarts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChartsModule } from 'ng2-charts';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
    TranslateModule,
    TranslateService
} from '@ngx-translate/core';

import { environment } from '../../environments/environment';
import { DemoMaterialModule } from '../material-module';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
import {
    BarTrendGraphComponent
} from './components/bar-trend-graph/bar-trend-graph.component';
import {
    ButtonIconToggleComponent
} from './components/button-icon-toggle/button-icon-toggle.component';
import {
    ButtonSlideToggleComponent
} from './components/button-slide-toggle/button-slide-toggle.component';
import {
    ButtonToggleComponent
} from './components/button-toggle/button-toggle.component';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ChipsComponent } from './components/chips/chips.component';
import { CityViewComponent } from './components/city-view/city-view.component';
import {
    ComponentDependencyComponent
} from './components/component-dependency/component-dependency.component';
import {
    DropdownPopoverComponent
} from './components/dropdown-popover/dropdown-popover.component';
import {
    EmptyScreenComponent
} from './components/empty-screen/empty-screen.component';
import {
    FormElementsComponent
} from './components/form-elements/form-elements.component';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import {
    IconCountLabelComponent
} from './components/icon-count-label/icon-count-label.component';
import {
    IconLabelComponent
} from './components/icon-label/icon-label.component';
import {
    IconSelectComponent
} from './components/icon-select/icon-select.component';
import {
    InlineSelectComponent
} from './components/inline-select/inline-select.component';
import {
    InternationalisationComponent
} from './components/internationalisation/internationalisation.component';
import {
    LabelCountComponent
} from './components/label-count/label-count.component';
import {
    LineGraphComponent
} from './components/line-graph/line-graph.component';
import { ListComponent } from './components/list/list.component';
import { MenuComponent } from './components/menu/menu.component';
import { ConfirmStateService } from './components/modal/confirm-state.service';
import { ConfirmService } from './components/modal/confirm.service';
import { ModalComponent } from './components/modal/modal.component';
import {
    ModuleDependencyGraphComponent
} from './components/module-dependency-graph/module-dependency-graph.component';
import {
    MultiGraphComponent
} from './components/multi-graph/multi-graph.component';
import {
    MultiSelectComponent
} from './components/multi-select/multi-select.component';
import {
    PaginationComponent
} from './components/pagination/pagination.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import {
    ProgressBarComponent
} from './components/progress-bar/progress-bar.component';
import { RadioComponent } from './components/radio/radio.component';
import { CardComponent } from './components/repository/card/card.component';
import {
    IssueCardComponent
} from './components/repository/issue-card/issue-card.component';
import {
    OverviewComponent
} from './components/repository/overview/overview.component';
import {
    PosterComponent
} from './components/repository/poster/poster.component';
import {
    CreateTaskPanelComponent
} from './components/side-panel/create-task-panel/create-task-panel.component';
import {
    DuplicationPanelComponent
} from './components/side-panel/duplication-panel/duplication-panel.component';
import {
    IssuesDetailsPanelComponent
} from './components/side-panel/issues-details-panel/issues-details-panel.component';
import {
    SingleAccordianComponent
} from './components/single-accordian/single-accordian.component';
import {
    SingleSelectComponent
} from './components/single-select/single-select.component';
import {
    SliderPopoverComponent
} from './components/slider-popover/slider-popover.component';
import {
    SnapshotSelectorDropdownComponent
} from './components/snapshot-selector-dropdown/snapshot-selector-dropdown.component';
import {
    StackedBarComponent
} from './components/stacked-bar/stacked-bar.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { TableComponent } from './components/table/table.component';
import { TabsComponent } from './components/tabs/tabs.component';
import {
    TitleDateComponent
} from './components/title-date/title-date.component';
import { ToastComponent } from './components/toast/toast.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import {
    TreeStructureComponent
} from './components/tree-structure/tree-structure.component';
import { TreeComponent } from './components/tree/tree.component';
import {
    TrendGraphComponent
} from './components/trend-graph/trend-graph.component';
import {
    TypographyComponent
} from './components/typography/typography.component';
import {
    UserProfileDropdownComponent
} from './components/user-profile-dropdown/user-profile-dropdown.component';
import { ConfirmModalDirective } from './directives/confirm-modal.directive';
import { SortableDirective } from './directives/sortable.directive';
import {
    PageNotFoundComponent
} from './pages/page-not-found/page-not-found.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';
import { DecimalNumberPipe } from './pipes/decimal-number.pipe';
import { MarkedPipe } from './pipes/marked.pipe';
import { RatingGradientPipe } from './pipes/rating-gradient.pipe';
import { RiskGradientPipe } from './pipes/risk-gradient.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { UrlLocationService } from './services/url-location.service';
import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import {
    DashboardSkeletonComponent
} from './skeletons/dashboard-skeleton/dashboard-skeleton.component';
import {
    DetailsPanelSkeletonComponent
} from './skeletons/details-panel-skeleton/details-panel-skeleton/details-panel-skeleton.component';
import {
    FiltersSkeletonComponent
} from './skeletons/filters-skeleton/filters-skeleton/filters-skeleton.component';
import {
    LinkRepositorySkeletonComponent
} from './skeletons/link-repository-skeleton/link-repository-skeleton.component';
import {
    OverviewSkeletonComponent
} from './skeletons/overview-skeleton/overview-skeleton.component';
import {
    RepositoryListSkeletonComponent
} from './skeletons/repository-list-skeleton/repository-list-skeleton.component';
import {
    ScanSkeletonComponent
} from './skeletons/scan-skeleton/scan-skeleton.component';
import {
    TableSkeletonComponent
} from './skeletons/scan-skeleton/table-skeleton/table-skeleton.component';
import { PartitionGraphComponent } from './components/partition-graph/partition-graph.component';
import { ScrollableTabsComponent } from './components/scrollable-tabs/scrollable-tabs.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { CodeViewMonacoEditorComponent } from './components/code-view-monaco-editor/code-view-monaco-editor.component';
import { ScanSelectorComponent } from './components/scan-selector/scan-selector.component';
import { SnapshotSelectorComponent } from './components/snapshot-selector/snapshot-selector.component';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { IconTextSelectComponent } from './components/icon-text-select/icon-text-select/icon-text-select.component';
import { AddUserListComponent } from './components/add-user-list/add-user-list.component';
import { DynamicTreeComponent } from './components/dynamic-tree/dynamic-tree/dynamic-tree.component';
import { UpgradeTeaserComponent } from './components/side-panel/upgrade-teaser/upgrade-teaser.component';
import { ConfirmSidePanelComponent } from './components/confirm-side-panel/confirm-side-panel.component';
import { PrivateAccessTokenPanelComponent } from './components/side-panel/private-access-token-panel/private-access-token-panel.component';
import { ClipboardModule } from 'ngx-clipboard';
import { TokenPanelSkeletonComponent } from './skeletons/token-panel-skeleton/token-panel-skeleton.component';
import { AddLinkRepositoryListComponent } from './components/repository/add-link-repository-list/add-link-repository-list.component';

export function onMonacoLoad() {
}

const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl: 'assets', // configure base path for monaco editor default: './assets'
    defaultOptions: {
        scrollBeyondLastLine: false,
        glyphMargin: true,
        // renderSideBySide: !config.inlineDiff,
        readOnly: true,
        hideCursorInOverviewRuler: true,
        disableLayerHinting: true,
        contextmenu: false,
        automaticLayout: true,
        minimap: {
            enabled: false
        }
    }, // pass default options to be used
    onMonacoLoad // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};
@NgModule({
    declarations: [InternationalisationComponent, LineGraphComponent, ButtonToggleComponent, ButtonIconToggleComponent,
        ChipsComponent, ButtonComponent, MenuComponent, SharedComponent,
        IconCountLabelComponent, TitleDateComponent, CheckboxComponent, TypographyComponent,
        ListComponent, TabsComponent, RadioComponent, FormElementsComponent, TooltipComponent, IconLabelComponent,
        PageNotFoundComponent, ForbiddenComponent, MultiSelectComponent, SingleSelectComponent, InlineSelectComponent,
        SnapshotSelectorDropdownComponent, ProgressBarComponent, TableComponent, RatingGradientPipe,
        LinkRepositorySkeletonComponent, OverviewSkeletonComponent, DashboardSkeletonComponent,
        RepositoryListSkeletonComponent, PaginationComponent, DropdownPopoverComponent,
        SliderPopoverComponent, BarTrendGraphComponent, PieChartComponent, EmptyScreenComponent,
        ShortNumberPipe, DateTimeFormatPipe, BarGraphComponent, CityViewComponent, TrendGraphComponent,
        LabelCountComponent, MultiGraphComponent, ScanSkeletonComponent, TableSkeletonComponent, TimeFormatPipe,
        SortableDirective, DateAgoPipe, DecimalNumberPipe, OverviewComponent, IssueCardComponent, CardComponent,
        PosterComponent, ModuleDependencyGraphComponent, StackedBarComponent, TreeComponent, TreeStructureComponent,
        ButtonSlideToggleComponent, UserProfileDropdownComponent, ModalComponent, ToastComponent,
        ConfirmModalDirective, MarkedPipe, IconSelectComponent, HeatMapComponent, SingleAccordianComponent,
        IssuesDetailsPanelComponent, StepperComponent, FiltersSkeletonComponent, ComponentDependencyComponent,
        CreateTaskPanelComponent, DuplicationPanelComponent, DetailsPanelSkeletonComponent, CodeViewMonacoEditorComponent,
        DetailsPanelSkeletonComponent, RiskGradientPipe, PartitionGraphComponent, ScrollableTabsComponent, ScanSelectorComponent,
        SnapshotSelectorComponent, AutocompleteComponent, DebounceClickDirective, IconTextSelectComponent, AddUserListComponent,
        DynamicTreeComponent, UpgradeTeaserComponent, ConfirmSidePanelComponent, PrivateAccessTokenPanelComponent,
        TokenPanelSkeletonComponent, AddLinkRepositoryListComponent],

    imports: [
        CommonModule, ChartsModule, NgSelectModule, TranslateModule, MatIconModule, MatCheckboxModule, MatSelectModule, NgxEchartsModule,
        SharedRoutingModule, DemoMaterialModule, NgbModule, FormsModule, ReactiveFormsModule,
        NgxSkeletonLoaderModule, NgMultiSelectDropDownModule.forRoot(), Ng5SliderModule, NgxSliderModule, ClipboardModule,
        NgxEchartsModule.forRoot({
            echarts
        }),
        MonacoEditorModule.forRoot(monacoConfig)
    ],
    exports: [
        MatIconModule, FormsModule, ReactiveFormsModule, TranslateModule, CommonModule, MatCheckboxModule, MatSelectModule, NgbModule,
        DemoMaterialModule, InternationalisationComponent, ButtonToggleComponent, ButtonIconToggleComponent,
        ChipsComponent, ButtonComponent, DateTimeFormatPipe, ShortNumberPipe, MenuComponent, IconCountLabelComponent,
        TitleDateComponent, CheckboxComponent, TypographyComponent, RadioComponent, FormElementsComponent,
        IconLabelComponent, SnapshotSelectorDropdownComponent, ProgressBarComponent, TableComponent, RatingGradientPipe,
        InlineSelectComponent, SingleSelectComponent, LinkRepositorySkeletonComponent, OverviewSkeletonComponent,
        DashboardSkeletonComponent, RepositoryListSkeletonComponent, PaginationComponent, EmptyScreenComponent,
        BarTrendGraphComponent, PieChartComponent, DropdownPopoverComponent, SliderPopoverComponent, LabelCountComponent, TabsComponent, ScrollableTabsComponent,
        ScanSkeletonComponent, TableSkeletonComponent, TimeFormatPipe, SortableDirective, MultiSelectComponent, TrendGraphComponent,
        BarGraphComponent, DateAgoPipe, DecimalNumberPipe, Ng5SliderModule, OverviewComponent, IssueCardComponent,
        CardComponent, PosterComponent, ModuleDependencyGraphComponent, StackedBarComponent, TreeComponent, DynamicTreeComponent,
        TreeStructureComponent, ButtonSlideToggleComponent, UserProfileDropdownComponent, ToastComponent,
        ModalComponent, ConfirmModalDirective, MarkedPipe, IconSelectComponent, CityViewComponent, HeatMapComponent, SingleAccordianComponent,
        IssuesDetailsPanelComponent, FiltersSkeletonComponent, ComponentDependencyComponent, DuplicationPanelComponent, DetailsPanelSkeletonComponent,
        RiskGradientPipe, PartitionGraphComponent, ScanSelectorComponent, CodeViewMonacoEditorComponent, NgxSliderModule, SnapshotSelectorComponent,
        AutocompleteComponent, IconTextSelectComponent, AddUserListComponent, UpgradeTeaserComponent, ConfirmSidePanelComponent,AddLinkRepositoryListComponent
    ],
    providers: [
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }, ShortNumberPipe, UrlLocationService,
        RatingGradientPipe, TimeFormatPipe, DateTimeFormatPipe, DateAgoPipe, DecimalNumberPipe, DecimalPipe, ConfirmService,
        ConfirmStateService, MarkedPipe, RiskGradientPipe
    ]
})
export class SharedModule {
    // constructor(private translateService: TranslateService) {
    //     translateService.setDefaultLang(environment.language);
    //     let currentLanguage = (localStorage.getItem('lang') !== undefined && localStorage.getItem('lang') !== '' && localStorage.getItem('lang') !== null) ? localStorage.getItem('lang') : 'en';
    //     this.translateService.setDefaultLang(currentLanguage);
    // }
}
