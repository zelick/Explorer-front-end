import { Component, OnInit } from '@angular/core';
import { TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'xp-tour-bundle-table',
  templateUrl: './tour-bundle-table.component.html',
  styleUrls: ['./tour-bundle-table.component.css']
})
export class TourBundleTableComponent implements OnInit {

  ngOnInit(): void {
    this.loadTourBundles();
  }

  tourBundles: TourBundle[] = [];
  pageSize = 5;
  pageIndex = 1;
  totalTourBundles = 0;

  constructor(private service: MarketplaceService, private router: Router) { }

  loadTourBundles(): void {
    this.service.getTourBundles(this.pageIndex, this.pageSize).subscribe((result) => {
      this.tourBundles = result.results;
      this.totalTourBundles = result.totalCount;
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;
    this.loadTourBundles();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.pageIndex = 1;
    this.loadTourBundles();
  }
}