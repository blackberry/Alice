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
 * Weather Data Fetcher
 *
 * @author Jim Ing
 * ===========================================================================
 */

$time_start = microtime(true);

$base_url = 'http://weyeipad.pelmorex.com/ipaddata/';

$place_code = isset($_GET['place_code']) ? $_GET['place_code'] : 'CAON0696';
$format = isset($_GET['format']) ? $_GET['format'] : 'json';

$output  = '';

//----------------------------------------------------------------------------

$xml_str = file_get_contents($base_url . $place_code);

$xml = simplexml_load_string($xml_str);

$time_elapsed = round((microtime(true) - $time_start), 4);

if ($format == 'json') {
    $json = json_encode($xml);

    $output .= $json;

    if (isset($_GET['debug'])) {
        $output .= PHP_EOL;
        $output .= '/*' . PHP_EOL;
        $output .= 'Elapsed time: ' . $time_elapsed . ' secs.' . PHP_EOL;
        $output .= 'Peak memory: ' . round((memory_get_peak_usage() / 1024)) . ' KB' . PHP_EOL;
        $output .= $base_url . $place_code . PHP_EOL;
        $output .= '*/' . PHP_EOL;
    }

    header('Content-Type: text/plain');
    echo $output;
}
else if ($format == 'php') {
    $output .= print_r($xml, true);

    if (isset($_GET['debug'])) {
        $output .= PHP_EOL;
        $output .= 'Elapsed time: ' . $time_elapsed . ' secs.' . PHP_EOL;
        $output .= 'Peak memory: ' . round((memory_get_peak_usage() / 1024)) . ' KB' . PHP_EOL;
        $output .= $base_url . $place_code . PHP_EOL;
    }

    header('Content-Type: text/plain');
    echo $output;
}
else {
    $output .= $xml->asXML();

    if (isset($_GET['debug'])) {
        $output .= PHP_EOL;
        $output .= '<!--' . PHP_EOL;
        $output .= 'Elapsed time: ' . $time_elapsed . ' secs.' . PHP_EOL;
        $output .= 'Peak memory: ' . round((memory_get_peak_usage() / 1024)) . ' KB' . PHP_EOL;
        $output .= $base_url . $place_code . PHP_EOL;
        $output .= '-->' . PHP_EOL;
    }

    header('Content-Type: text/xml');
    echo $output;
}
?>
