import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    ActivatedRoute,
    Params
} from '@angular/router';

import { Options } from 'ng5-slider';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import {
    RatingGradientPipe
} from '../../../../../shared/pipes/rating-gradient.pipe';
import { ShortNumberPipe } from '../../../../../shared/pipes/short-number.pipe';
import {
    LanguageService
} from '../../../../../shared/services/language.service';
import {
    RepositoryDashboardService
} from '../../repository-dashboard/repository-dashboard.service';
import { RepositoryDashboardOverview } from './dashboard-overview';

interface language {

    color?: string,
    name?: string,
    displayName?: string,
    label?: {
        backgroundColor: string,
        rich: {
            b: {
                color: string
            }
        }
    },
    languageName: string,
    value: number
}
@Component({
    selector: 'app-dashboard-overview',
    templateUrl: './dashboard-overview.component.html',
    styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
    @Input() repoOverviewData: RepositoryDashboardOverview;
    constructor(private languageService: LanguageService, private shortNumber: ShortNumberPipe, private translateService: TranslateService, private route: ActivatedRoute, private repositoryDashboardService: RepositoryDashboardService,
        private ratingGradient: RatingGradientPipe) {
        this.loadRepoDashBoardOverview = Promise.resolve(false);
    }
    repositoryUid: string;
    ratingChange: number;
    ratingSymbol: string;
    locChange: number;
    locChangeLabel: string;
    locIncrease: boolean;
    ratingIncrease: boolean;
    locText: string;
    ratingVariation: boolean = true;
    locVariation: boolean = true;
    languages: language[];
    loadRepoDashBoardOverview: Promise<boolean>;
    paramsSubscription: Subscription;
    rating: string;
    value: number = 0;
    options: Options = {
        floor: -5,
        ceil: 5,
        step: 0.01,
        readOnly: true,
        translate: (value: number): string => {
            let color = this.ratingGradient.transform(value);
            return '<span style="color:' + color + '">' + value + '</span>';
        }
    };

    ngOnInit(): void {
        this.route.parent.params.subscribe(
            (params: Params) => {
                this.repositoryUid = (params['repositoryUid']).toString();
                //call to service will go here
                this.paramsSubscription = this.route.queryParams.subscribe(repoParams => {
                    this.repositoryDashboardService.setParameters(this.repositoryUid, repoParams.snapshotId);
                    this.getRepositoryOverview();
                });
            }
        );


    }

    getRepositoryOverview(): void {
        this.repositoryDashboardService.getRepositoryOverview();
        this.repositoryDashboardService.getRepositoryOverviewData().subscribe(overviewDetails => {
            this.rating = `${overviewDetails.rating}`;
            let fixedNumber = 2;
            this.repoOverviewData = overviewDetails;
            this.ratingChange = Number((this.repoOverviewData.rating - this.repoOverviewData.oldRating).toFixed(fixedNumber));
            this.locChange = this.repoOverviewData.loc - this.repoOverviewData.oldLoc;
            this.languages = this.repoOverviewData.languages;
            (this.languages).map(d => {
                d.color = this.languageService.languageColorMap[0][d.languageName].backgroundColor;
                d.label = {
                    backgroundColor: this.languageService.languageColorMap[0][d.languageName].backgroundColor,
                    rich: {
                        b: {
                            color: this.languageService.languageColorMap[0][d.languageName].color
                        }
                    }
                }
                this.translateService.get(`languages.${d.languageName}`).subscribe((text: string) => {
                    d.name = text;
                    d.displayName = text;
                });
            });

            this.value = this.repoOverviewData.rating;
            if (this.ratingChange > 0) {
                this.ratingSymbol = '+';
                this.ratingChange = this.ratingChange;
                this.ratingVariation = true;
                this.ratingIncrease = true;
            } else if (this.ratingChange < 0) {
                this.ratingSymbol = '';
                this.ratingIncrease = false;
                this.ratingVariation = true;
            } else {
                this.ratingSymbol = '';
                this.ratingVariation = false;
            }
            if (this.locChange > 0) {
                this.locChangeLabel = `${this.shortNumber.transform(this.locChange)}`;
                this.locText = 'loc_increase';
                this.locIncrease = true;
                this.locVariation = true;
            }
            else if (this.locChange < 0) {
                this.locChangeLabel = `${this.shortNumber.transform(Math.abs(this.locChange))}`;
                this.locText = 'loc_decrease';
                this.locIncrease = false;
                this.locVariation = true;
            }
            else {
                this.locVariation = false;
            }
            this.loadRepoDashBoardOverview = Promise.resolve(true);
        });
    };

}
