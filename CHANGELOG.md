# api-session-ts Changelog

## 0.0.12 (2025/08/27)

* Accept a function for `coerce_dates`
* Automatically coerce dates for fields ending with `_at` or `_date`
* Add `is_date_field`, `keep_invalid_dates` options

## 0.0.11 (2025/08/27)

* Add the `coerce_dates` option

## 0.0.10 (2025/08/26)

* Add `.headOk`

## 0.0.9 (2025/08/26)

* Add `api-session-ts/utils` with `makeURLSearchParams`

Intermediary versions have broken builds.

## 0.0.6 (2025/01/28)

* Fix the HTTP method of `.delete()`

## 0.0.5 (2025/01/22)

* Fix exports again

## 0.0.4 (2025/01/21)

* Fix exports

## 0.0.3 (2025/01/21)

* Rename `.delete_()` as `.delete()`
* Declare the package as a module

## 0.0.2 (2025/01/21)

* Add `HTTPError`
* Add default headers, default user-agent, `readonly`
* Add `.fetch`, `.getJSON`, `postJSON`, `putJSON`, `get`, `head`, `delete_`, `options`

## 0.0.1 (2025/01/21)

Initial empty release.
