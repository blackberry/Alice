<?php
/* Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* ===========================================================================
 * Stock Quote Fetcher
 *
 * @author Jim Ing
 * ===========================================================================
 */

$sym = (isset($_GET['sym'])) ? $_GET['sym'] : 'RIM.TO';

$url = 'http://download.finance.yahoo.com/d/quotes.csv?s=' . $sym . '&f=sl1d1t1c1ohgv&e=.csv';

$fields = array(
    'symbol',
    'last_trade',
    'update_date',
    'update_time',
    'change',
    'prev_close',
    'day_high',
    'day_low',
    'volume'
);

try {
    $time_start = microtime(true);

    $output = '';

    $csv_str = trim(file_get_contents($url));
    $data = split(",", $csv_str);

    $output = '{' . PHP_EOL;
    for ($i = 0; $i < count($data); $i++) {
        $output .= "\t" . '"' . $fields[$i] . '": "' . str_replace('"', '', $data[$i]) . '"';
        $output .= ($i < count($data) - 1) ? ',' : '';
        $output .= PHP_EOL;
    }
    $output .= '}' . PHP_EOL;

    $time_elapsed = round((microtime(true) - $time_start), 4);

    if (isset($_GET['debug'])) {
        $output .= PHP_EOL;
        $output .= '/*' . PHP_EOL;
        $output .= 'Elapsed time: ' . $time_elapsed . ' secs.' . PHP_EOL;
        $output .= 'Peak memory: ' . round((memory_get_peak_usage() / 1024)) . ' KB' . PHP_EOL;
        $output .= '*/' . PHP_EOL;
    }

    header('Content-Type: text/plain; charset=utf-8');

    echo $output;
}
catch (Exception $e) {
    header('Content-Type: text/plain; charset=utf-8');

    die('Exception: ' . $e->getMessage());
}
?>
