let array, colors,sorter,representation,w,
paused = true;
  
const LINE = 1;

const algorithms = {
  bubbleSort: {
    name: 'Bubble sort',
    count: 50,
    representation: LINE,
    sorter: function*(arr, colors) {
      for (let n = arr.length; n > 0; --n) {
        for (let i = 0; i < n - 1; ++i) {
          colors[i] = color('#FF5252');
          colors[i + 1] = color('#AAF255');
          yield colors;
          colors[i] = color('#7C4DFF');
          colors[i + 1] = color('#7C4DFF');
          if (arr[i] > arr[i + 1]) {
            swap(arr, i, i + 1);
          }
        }
        colors[n - 1] = color('#F57C00');
      }
      return colors;
    }
  },
  selectionSort: {
    name: 'Selection sort',
    count: 50,
    representation: LINE,
    sorter: function*(arr, colors) {
      for (let i = arr.length - 1; i >= 0; --i) {
        
        let index = i;
        for (let j = 0; j <= i; ++j) {
          colors[j] = color('#FF5252');
          colors[index] = color('#AAF255');
          yield colors;
          colors[j] = color('#7C4DFF');
          colors[index] = color('#7C4DFF');
          if (arr[j] > arr[index]) {
            index = j;
          }
        }
        if (index !== i) {
          swap(arr, i, index);
        }
        colors[i] = color('#F57C00');
        yield colors;
      }
      return colors;
    }
  },

  insertionSort: {
    name: 'Insertion sort',
    count: 70,
    representation: LINE,
    sorter: function*(arr, colors) {
      for (let i = 1; i < arr.length; ++i) {
        let j = i - 1;
        while (j >= 0 && arr[j] > arr[i]) {
          colors[i] = color('#AAF255');
          yield colors;
          colors[i] = color('#F57C00');
          swap(arr, i, j);
          swap(colors, i--, j--);
        }
      }
      return colors;
    }
  },
  mergeSort: {
    name: 'Merge sort',
    count: 150,
    representation: LINE,
    sorter: function*(arr, colors, start = 0, end = arr.length - 1, self = this) {
      if (start < end) {
        let middle = floor((start + end) / 2);
        yield* self['sorter'](arr, colors, start, middle, self);
        yield* self['sorter'](arr, colors, middle + 1, end, self);

        yield* self['helpers']['merge'](arr, colors, start, middle, end);
      }
      return colors;
    },
    helpers: {
      merge: function*(arr, colors, start, middle, end) {
        let i = start;
        let j = middle + 1;

        while (i <= middle && j <= end) {
          colors[i] = color('#AAF255');
          colors[j] = color('#AAF255');
          yield colors;
          colors[i] = color('#F57C00');
          colors[j] = color('#F57C00');
          if (arr[i] > arr[j]) {
            for (let k = i; k <= j; ++k) {
              swap(arr, k, j);
              swap(colors, k, j);
            }
            ++j;
            ++middle;
          }
          ++i;
        }
      }
    }
  },
  quickSort: {
    name: 'Quick sort',
    count: 150,
    representation: LINE,
    sorter: function*(arr, colors, start = 0, end = arr.length - 1, self = this) {
      if (start < end) {  
        let ref = {};
        yield* self['helpers']['partition'](arr, colors, start, end, ref);
        let p = ref[''];
        yield* self['sorter'](arr, colors, start, p - 1);
        yield* self['sorter'](arr, colors, p + 1, end);
      } else {
        colors[start] = color('#F57C00');
      }
      return colors;
    },
    helpers: {
      partition: function*(arr, colors, start, end, i) {
        let pivot = arr[end];
        i[''] = start;

        for (let j = i['']; j < end; ++j) {
          if (arr[j] < pivot) { 
            colors[i['']] = color('#AAF255');
            colors[j] = color('#AAF255');
            yield colors;
            colors[i['']] = color('#7C4DFF');
            colors[j] = color('#7C4DFF');
            swap(arr, i['']++, j);
          }
        }
        swap(arr, i[''], end);
        colors[i['']] = color('#F57C00');
      }
    }
  },
}

var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(1000, 400);
  centerCanvas();

  let select_algorithm = createSelect();
  select_algorithm.position(50, 200);

  for (let algo in algorithms) {
    select_algorithm.option(algorithms[algo]['name'], algo);
  }

  select_algorithm.changed(() => {
    let algorithm = algorithms[select_algorithm.value()];
    input_count.value(algorithm['count']);
    init(algorithm, algorithm['count']);
    shuffle(array, true);
  });

  let input_count = createInput(algorithms[select_algorithm.value()]['count'].toString());
  input_count.position(60, 230);
  input_count.attribute('type', 'number');
  input_count.attribute('min', '10');
  input_count.attribute('max', '1000');

  let button_range = createButton('Range');
  button_range.position(68, 335);
  button_range.mousePressed(() => {
    init(algorithms[select_algorithm.value()], parseInt(input_count.value()));
  });

  let button_reversed = createButton('Reversed');
  button_reversed.position(60, 300);
  button_reversed.mousePressed(() => {
    init(algorithms[select_algorithm.value()], parseInt(input_count.value()));
    reverse(array);
  });

  let button_shuffled = createButton('Shuffled');
  button_shuffled.position(65, 265);
  button_shuffled.mousePressed(() => {
    init(algorithms[select_algorithm.value()], parseInt(input_count.value()));
    shuffle(array, true);
  });

  let button_pause = createButton('Pause');
  button_pause.position(68, 370);
  button_pause.mousePressed(() => {
    paused = true
  });

  let button_next = createButton('Next');
  button_next.position(70, 405);
  button_next.mousePressed(() => {
    if (paused) {
      paused = false;
      redraw();
      paused = true;
    }
  });
  
  let button_sort = createButton('Sort!');
  button_sort.position(70, 440);
  button_sort.mousePressed(() => {
    if (!paused) {
      init(algorithms[select_algorithm.value()], parseInt(input_count.value()));
      shuffle(array, true);
    }
    paused = false;
  });

  init(algorithms[select_algorithm.value()], parseInt(input_count.value()));
  shuffle(array, true);
}

function windowResized() {
  centerCanvas();
}

function init(algo, length) {
  paused = true;
  w = width / length;

  representation = algo['representation'];
  array = Array.from({
    length
  }, (v, i) => map(i, 0, length - 1, height / length, height-50));
  colors = Array(length).fill(color('#7C4DFF')); 
  sorter = algo['sorter'](array, colors);
}

function draw() {
  background(255);
  stroke(255);

  if (!paused) {
    let next = sorter.next();
    colors = next.value;
    paused = next.done;
  }
  for (let i = 0; i < array.length; ++i) {
    fill(colors[i]);
    if (representation === LINE) {
      rect(i * w, height - array[i], w, array[i]);
    } 
  }
}
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
