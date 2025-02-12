/* Copyright 2018 The Chromium Authors. All rights reserved.
   Use of this source code is governed by a BSD-style license that can be
   found in the LICENSE file.
*/
'use strict';

import {assert} from 'chai';
import {
  MODE,
  computeTicks,
  layoutTimeseries,
} from './layout-timeseries.js';

suite('layout-timeseries', function() {
  // suite() callbacks may be called before imports are loaded, so wrap
  // references to |tr|.
  function explicitRange(min, max) {
    return tr.b.math.Range.fromExplicitRange(min, max);
  }

  test('normalize unit', async function() {
    const input = {
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1, y: 3},
            {x: 2, y: 2},
            {x: 3, y: 4},
          ],
        },
        {
          unit: tr.b.Unit.byName.sizeInBytes_smallerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
        {
          unit: tr.b.Unit.byName.count_biggerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
      ],
      xAxis: {
      },
      yAxis: {
        generateTicks: true,
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(output.lines[0].path, 'M1.2,97.2 L50,99.8 L98.8,94.7');
    assert.strictEqual(output.lines[1].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.strictEqual(output.lines[2].path, 'M1.2,27.7 L50,53.5 L98.8,2');
    assert.deepEqual(output.yAxis.ticksForUnitName.get('count'), [
      {text: '4', yPct: '94.7%'},
      {text: '13', yPct: '72.1%'},
      {text: '22', yPct: '49.6%'},
      {text: '30', yPct: '27.1%'},
      {text: '39', yPct: '4.6%'},
    ]);

    assert.deepEqual(output.yAxis.ticksForUnitName.get('sizeInBytes'), [
      {text: '21.0 B', yPct: '91.9%'},
      {text: '25.5 B', yPct: '71%'},
      {text: '30.0 B', yPct: '50.1%'},
      {text: '34.5 B', yPct: '29.2%'},
      {text: '39.0 B', yPct: '8.3%'},
    ]);
  });

  test('normalize line', async function() {
    const input = {
      mode: MODE.NORMALIZE_LINE,
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1, y: 3},
            {x: 2, y: 2},
            {x: 3, y: 4},
          ],
        },
        {
          unit: tr.b.Unit.byName.sizeInBytes_smallerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
        {
          unit: tr.b.Unit.byName.count_biggerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
      ],
      xAxis: {
      },
      yAxis: {
        generateTicks: true,
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(output.lines[0].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.strictEqual(output.lines[1].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.strictEqual(output.lines[2].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.deepEqual(output.lines[0].ticks, [
      {text: '2', yPct: '91.9%'},
      {text: '3', yPct: '71%'},
      {text: '3', yPct: '50.1%'},
      {text: '3', yPct: '29.2%'},
      {text: '4', yPct: '8.3%'},
    ]);
    assert.deepEqual(output.lines[1].ticks, [
      {text: '21.0 B', yPct: '91.9%'},
      {text: '25.5 B', yPct: '71%'},
      {text: '30.0 B', yPct: '50.1%'},
      {text: '34.5 B', yPct: '29.2%'},
      {text: '39.0 B', yPct: '8.3%'},
    ]);
    assert.deepEqual(output.lines[2].ticks, [
      {text: '21', yPct: '91.9%'},
      {text: '26', yPct: '71%'},
      {text: '30', yPct: '50.1%'},
      {text: '35', yPct: '29.2%'},
      {text: '39', yPct: '8.3%'},
    ]);
  });

  test('delta', async function() {
    const input = {
      mode: MODE.DELTA,
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1, y: 3},
            {x: 2, y: 2},
            {x: 3, y: 4},
          ],
        },
        {
          unit: tr.b.Unit.byName.sizeInBytes_smallerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
        {
          unit: tr.b.Unit.byName.count_biggerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
      ],
      xAxis: {
      },
      yAxis: {
        generateTicks: true,
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(output.lines[0].path, 'M1.2,97.2 L50,99.8 L98.8,94.7');
    assert.strictEqual(output.lines[1].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.strictEqual(output.lines[2].path, 'M1.2,27.7 L50,53.5 L98.8,2');
    assert.deepEqual(output.yAxis.ticksForUnitName.get('count'), [
      {text: '4', yPct: '94.7%'},
      {text: '13', yPct: '72.1%'},
      {text: '22', yPct: '49.6%'},
      {text: '30', yPct: '27.1%'},
      {text: '39', yPct: '4.6%'},
    ]);

    assert.deepEqual(output.yAxis.ticksForUnitName.get('sizeInBytes'), [
      {text: '21.0 B', yPct: '91.9%'},
      {text: '25.5 B', yPct: '71%'},
      {text: '30.0 B', yPct: '50.1%'},
      {text: '34.5 B', yPct: '29.2%'},
      {text: '39.0 B', yPct: '8.3%'},
    ]);
  });

  test('center', async function() {
    const input = {
      mode: MODE.CENTER,
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1, y: 3},
            {x: 2, y: 2},
            {x: 3, y: 4},
          ],
        },
        {
          unit: tr.b.Unit.byName.sizeInBytes_smallerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
        {
          unit: tr.b.Unit.byName.count_biggerIsBetter,
          data: [
            {x: 1, y: 30},
            {x: 2, y: 20},
            {x: 3, y: 40},
          ],
        },
      ],
      xAxis: {
      },
      yAxis: {
        generateTicks: true,
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(output.lines[0].path, 'M1.2,50 L50,54.7 L98.8,45.4');
    assert.strictEqual(output.lines[1].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.strictEqual(output.lines[2].path, 'M1.2,50.1 L50,96.5 L98.8,3.6');
    assert.deepEqual(output.lines[0].ticks, [
      {text: '-4', yPct: '83.7%'},
      {text: '0', yPct: '63.9%'},
      {text: '4', yPct: '44.2%'},
      {text: '9', yPct: '24.5%'},
      {text: '13', yPct: '4.7%'},
    ]);
    assert.deepEqual(output.lines[1].ticks, [
      {text: '21.0 B', yPct: '91.9%'},
      {text: '25.5 B', yPct: '71%'},
      {text: '30.0 B', yPct: '50.1%'},
      {text: '34.5 B', yPct: '29.2%'},
      {text: '39.0 B', yPct: '8.3%'},
    ]);
    assert.deepEqual(output.lines[2].ticks, [
      {text: '21', yPct: '91.9%'},
      {text: '26', yPct: '71%'},
      {text: '30', yPct: '50.1%'},
      {text: '35', yPct: '29.2%'},
      {text: '39', yPct: '8.3%'},
    ]);
  });

  test('computeTicks', async function() {
    assert.deepEqual(computeTicks(explicitRange(-11, 11)), [
      -10.5, -5.25, 0, 5.25, 10.5,
    ]);
    assert.deepEqual(computeTicks(explicitRange(1, 11)), [
      2, 4.25, 6.5, 8.75, 11,
    ]);
    assert.deepEqual(computeTicks(explicitRange(-1, 11)), [
      0, 2.75, 5.5, 8.25, 11,
    ]);
    assert.deepEqual(computeTicks(explicitRange(-11111, 11111)), [
      -10500, -5250, 0, 5250, 10500,
    ]);
    assert.deepEqual(computeTicks(explicitRange(1, 11111)), [
      1000, 3500, 6000, 8500, 11000,
    ]);
    assert.deepEqual(computeTicks(explicitRange(-1, 11111)), [
      0, 2500, 5000, 7500, 10000,
    ]);
  });

  test('revision ticks fixedXAxis', async function() {
    const input = {
      fixedXAxis: true,
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 12800, y: 2},
            {x: 13000, y: 4},
            {x: 13200, y: 2},
            {x: 13400, y: 4},
            {x: 13600, y: 4},
            {x: 13800, y: 2},
            {x: 14000, y: 4},
            {x: 14200, y: 4},
            {x: 14400, y: 4},
            {x: 14600, y: 4},
            {x: 14800, y: 4},
          ],
        },
      ],
      xAxis: {
        generateTicks: true,
      },
      yAxis: {
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.deepEqual(output.xAxis.ticks, [
      {text: 12900, xPct: '10%'},
      {text: 13375, xPct: '30%'},
      {text: 13850, xPct: '60%'},
      {text: 14325, xPct: '80%'},
      {text: 14800, xPct: '100%'},
    ]);
  });

  test('calendarTicks ms', async function() {
    const input = {
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1280000000000, y: 2},
            {x: 1300000000000, y: 4},
            {x: 1320000000000, y: 2},
            {x: 1340000000000, y: 4},
            {x: 1360000000000, y: 4},
            {x: 1380000000000, y: 2},
            {x: 1400000000000, y: 4},
            {x: 1420000000000, y: 4},
            {x: 1440000000000, y: 4},
            {x: 1460000000000, y: 4},
            {x: 1480000000000, y: 4},
          ],
        },
      ],
      xAxis: {
        generateTicks: true,
      },
      yAxis: {
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(JSON.stringify(output.xAxis.ticks), JSON.stringify([
      {
        ms: 1280000000000,
        text: '2010-07-24 19:33:20',
        xPct: '0%',
        anchor: 'start',
        px: explicitRange(0, 152),
      },
      {
        ms: 1325404800000,
        text: '2012',
        xPct: '22.7%',
        px: explicitRange(211, 243),
      },
      {
        ms: 1357027200000,
        text: '2013',
        xPct: '38.5%',
        px: explicitRange(369, 401),
      },
      {
        ms: 1388563200000,
        text: '2014',
        xPct: '54.3%',
        px: explicitRange(527, 559),
      },
      {
        ms: 1420099200000,
        text: '2015',
        xPct: '70%',
        px: explicitRange(684, 716),
      },
      {
        ms: 1480000000000,
        text: '2016-11-24 15:06:40',
        xPct: '100%',
        anchor: 'end',
        px: explicitRange(848, 1000),
      },
    ]));
  });

  test('calendarTicks s', async function() {
    const input = {
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1280000000, y: 2},
            {x: 1300000000, y: 4},
            {x: 1320000000, y: 2},
            {x: 1340000000, y: 4},
            {x: 1360000000, y: 4},
            {x: 1380000000, y: 2},
            {x: 1400000000, y: 4},
            {x: 1420000000, y: 4},
            {x: 1440000000, y: 4},
            {x: 1460000000, y: 4},
            {x: 1480000000, y: 4},
          ],
        },
      ],
      xAxis: {
        generateTicks: true,
      },
      yAxis: {
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(JSON.stringify(output.xAxis.ticks), JSON.stringify([
      {
        ms: 1280000000000,
        text: '2010-07-24 19:33:20',
        xPct: '0%',
        anchor: 'start',
        px: explicitRange(0, 152),
      },
      {
        ms: 1325404800000,
        text: '2012',
        xPct: '22.7%',
        px: explicitRange(211, 243),
      },
      {
        ms: 1357027200000,
        text: '2013',
        xPct: '38.5%',
        px: explicitRange(369, 401),
      },
      {
        ms: 1388563200000,
        text: '2014',
        xPct: '54.3%',
        px: explicitRange(527, 559),
      },
      {
        ms: 1420099200000,
        text: '2015',
        xPct: '70%',
        px: explicitRange(684, 716),
      },
      {
        ms: 1480000000000,
        text: '2016-11-24 15:06:40',
        xPct: '100%',
        anchor: 'end',
        px: explicitRange(848, 1000),
      },
    ]));
  });

  test('calendarTicks fixedXAxis', async function() {
    const input = {
      fixedXAxis: true,
      lines: [
        {
          unit: tr.b.Unit.byName.count_smallerIsBetter,
          data: [
            {x: 1280000000000, y: 2},
            {x: 1300000000000, y: 4},
            {x: 1320000000000, y: 2},
            {x: 1340000000000, y: 4},
            {x: 1360000000000, y: 4},
            {x: 1380000000000, y: 2},
            {x: 1400000000000, y: 4},
            {x: 1420000000000, y: 4},
            {x: 1440000000000, y: 4},
            {x: 1460000000000, y: 4},
            {x: 1480000000000, y: 4},
          ],
        },
      ],
      xAxis: {
        generateTicks: true,
      },
      yAxis: {
      },
    };
    await layoutTimeseries.readyPromise;
    const output = layoutTimeseries(input);

    assert.strictEqual(JSON.stringify(output.xAxis.ticks), JSON.stringify([
      {
        ms: 1280000000000,
        text: '2010-07-24 19:33:20',
        xPct: '0%',
        anchor: 'start',
        px: explicitRange(0, 152),
      },
      {
        ms: 1280646000000,
        text: 'Aug',
        xPct: '20%',
        px: explicitRange(188, 212),
      },
      {
        ms: 1325404800000,
        text: '2012',
        xPct: '40%',
        px: explicitRange(384, 416),
      },
      {
        ms: 1357027200000,
        text: '2013',
        xPct: '50%',
        px: explicitRange(484, 516),
      },
      {
        ms: 1388563200000,
        text: '2014',
        xPct: '70%',
        px: explicitRange(684, 716),
      },
      {
        ms: 1480000000000,
        text: '2016-11-24 15:06:40',
        xPct: '100%',
        anchor: 'end',
        px: explicitRange(848, 1000),
      },
    ]));
  });
});
