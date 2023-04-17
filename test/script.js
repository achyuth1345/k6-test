
import http from 'k6/http';
import { sleep } from 'k6';
import addition from '../commonmethod/common_method.js';

export default function () {
  http.get('https://test.k6.io');
  var s=addition(1,3);
  console.log(s);
}
