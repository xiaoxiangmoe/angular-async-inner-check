import {
  ChangeDetectorRef,
  EventEmitter,
  OnDestroy,
  Pipe,
  PipeTransform,
  WrappedValue,
  ɵisObservable,
  ɵstringify as stringify,
  ɵlooseIdentical,
  NgZone,
} from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';

interface SubscriptionStrategy {
  createSubscription(
    async: Observable<any>,
    updateLatestValue: any
  ): SubscriptionLike;
  dispose(subscription: SubscriptionLike): void;
  onDestroy(subscription: SubscriptionLike): void;
}

class ObservableStrategy implements SubscriptionStrategy {
  createSubscription(
    async: Observable<any>,
    updateLatestValue: any
  ): SubscriptionLike {
    return async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      },
    });
  }

  dispose(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }

  onDestroy(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }
}

const _observableStrategy = new ObservableStrategy();

/**
 * @ngModule CommonModule
 * @description
 *
 * Unwraps a value from an asynchronous primitive.
 *
 * The `async` pipe subscribes to an `Observable` and returns the latest value it has
 * emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
 * changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
 * potential memory leaks.
 */
@Pipe({ name: 'asyncInnerCheck', pure: false })
export class AsyncInnerCheckPipe implements OnDestroy, PipeTransform {
  private _latestValue: any = null;
  private _latestReturnedValue: any = null;

  private _subscription: SubscriptionLike | null = null;
  private _obj: Observable<any> | EventEmitter<any> | null = null;
  private _strategy!: SubscriptionStrategy;

  constructor(private _ref: ChangeDetectorRef, private _ngZone: NgZone) {}

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
  }

  transform<T>(obj: Observable<T> | null | undefined): T | null;
  transform(obj: Observable<any> | null | undefined): any {
    if (!this._obj) {
      if (obj) {
        this._subscribe(obj);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj as any);
    }

    if (ɵlooseIdentical(this._latestValue, this._latestReturnedValue)) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return WrappedValue.wrap(this._latestValue);
  }

  private _subscribe(obj: Observable<any> | EventEmitter<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._ngZone.runOutsideAngular(() => {
      this._subscription = this._strategy.createSubscription(
        obj,
        (value: any) => this._updateLatestValue(obj, value)
      );
    });
  }

  private _selectStrategy(obj: Observable<any> | EventEmitter<any>): any {
    if (ɵisObservable(obj)) {
      return _observableStrategy;
    }

    throw Error(
      `InvalidPipeArgument: '${obj}' for pipe '${stringify(
        AsyncInnerCheckPipe
      )}'`
    );
  }

  private _dispose(): void {
    if (this._subscription) {
      this._strategy.dispose(this._subscription);
    }
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: any, value: any): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.detectChanges();
    }
  }
}
