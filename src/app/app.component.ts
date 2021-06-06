import { 
  AfterViewInit, 
  Component, 
  ViewChild, 
  ElementRef 
} from '@angular/core';
import { Router } from '@angular/router';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import { HandGesture } from './hand-gesture.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'tensorflow-visual-navigation';
  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('home')
  home!: ElementRef<HTMLAnchorElement>;
  @ViewChild('about')
  about!: ElementRef<HTMLAnchorElement>;

  constructor(
    private _recognizer: HandGesture,
    private _router: Router,
  ){
    this._recognizer
        .gesture$
        .pipe(
          filter((value) => value === 'ok'),
          withLatestFrom(this.selection$)
        ).subscribe(([_, page]) => this._router.navigateByUrl((page as string)))
  }

  opened$ = this._recognizer.swipe$.pipe(
    filter((value) => value === 'left' || value === 'right'),
    map((value) => value === 'right')
  );

  selection$ = this._recognizer.gesture$.pipe(
    filter((value) => value === 'one' || value === 'two'),
    map((value) => (value === 'one' ? 'home' : 'about'))
  );

  ngAfterViewInit(): void {
    this._recognizer.initialize(
      this.canvas.nativeElement,
      this.video.nativeElement
    );
  }

  get stream(): MediaStream {
    return this._recognizer.stream;
  }
}
