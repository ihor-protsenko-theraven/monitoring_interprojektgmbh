import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StationDetail } from './station-detail';
import { StationsStore } from '../../data/stations.store';

describe('Station detail filters', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [StationDetail],
      providers: [StationsStore, provideRouter([])],
    }),
  );
  it('defaults to 30 days from the mock reference date and keeps monthly data independent', () => {
    const fixture = TestBed.createComponent(StationDetail);
    fixture.componentRef.setInput('id', 'kroshnya');
    const detail = fixture.componentInstance;
    expect(detail.filtered()).toHaveLength(30);
    const monthly = detail.monthly();
    detail.setDate('from', '2026-07-22');
    expect(detail.filtered()).toHaveLength(1);
    expect(detail.monthly()).toBe(monthly);
    detail.setDate('from', '2026-07-23');
    expect(detail.invalidPeriod()).toBe(true);
    expect(detail.filtered()).toHaveLength(0);
  });
  it('filters and reverses only non-normal notifications', () => {
    const fixture = TestBed.createComponent(StationDetail);
    fixture.componentRef.setInput('id', 'pivnichnozahidna');
    const detail = fixture.componentInstance;
    detail.filter.set('ZUPYNKA');
    expect(detail.alerts()).toHaveLength(4);
    expect(detail.alerts()[0].date).toBe('2026-07-22');
    expect(detail.alerts().every((d) => d.status === 'ZUPYNKA')).toBe(true);
  });
  it('handles an unknown station and resets period on route-id changes', () => {
    const fixture = TestBed.createComponent(StationDetail);
    fixture.componentRef.setInput('id', 'kroshnya');
    fixture.componentInstance.setDate('from', '2026-01-01');
    fixture.componentRef.setInput('id', 'vitruka');
    expect(fixture.componentInstance.filtered()).toHaveLength(30);
    fixture.componentRef.setInput('id', 'unknown');
    expect(fixture.componentInstance.station()).toBeUndefined();
    expect(fixture.componentInstance.filtered()).toHaveLength(0);
  });
});
