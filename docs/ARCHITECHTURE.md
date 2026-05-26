# System Architecture

## Overview

Fleet Manager is designed as a lightweight, high-performance distributed monitoring system.

## Components

### 1. Fleet Agent (C++)
- Lightweight agent deployed on edge devices.
- Collects metrics and reports to the backend.
- Exposes a local REST API for health checks and configuration.

### 2. Fleet Backend (C++)
- Centralized orchestrator.
- Manages device registrations, command dispatching, and data persistence (SQLite).
- Provides a RESTful API for the UI.

### 3. Fleet UI (Next.js)
- React-based dashboard.
- Real-time visualization of fleet status.

## Communication

- **Agent -> Backend:** Reports status and metrics via HTTP/REST.
- **UI -> Backend:** Management operations and status queries.
- **Backend -> Agent:** Control commands (e.g., via SSH or persistent connections).

## Tech Stack

- **Backend/Agent:** C++20, Crow (Web Framework), fmt, spdlog, vcpkg.
- **Frontend:** Next.js 15+, Tailwind CSS, TypeScript.
- **Deployment:** Docker, Docker Compose.

## System Architcture

![System Architecture](`https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=SystemArchitecture%20(1).drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22Page-1%22%20id%3D%22uOpYGMKQpD3lk_mJ-vG3%22%3E7VtNc6M4EP01PiYFiA9zjJ1MdmonU6m4tjLZm2JkmwpGHsATZ379SiABEsQQEA7rGl%2BMGtSCfv26W409AfPt4TaCu80d9lAwMTTvMAHXE8PQNaCRLyp5YxJdMzPJOvI9JisEC%2F834lOZdO97KBYuTDAOEn8nCpc4DNEyEWQwivCreNkKB%2BKqO7hmK2qFYLGEAapc9uh7ySaTTg2nkP%2BF%2FPWGr6zbbnbmGS5f1hHeh2y9iQFW6Sc7vYVcF1s33kAPv5ZE4GYC5hHGSXa0PcxRQI3LzZbN%2B%2FLO2fy%2BIxQmbSbczqynf%2B9f%2FEf%2FEV7vNjfwKYgvDMG48DmQbVVoZwvGyRu%2FiD79bgJmqREQXUYno%2ByyXzDYI26YVICiBB1Kqthd3iK8RUn0Ri7ZlO08ZbfwWoCS3xZXw8fM9y5yAWROsc6VF4YhB8w29XY67BYPVzs3%2BfvrG%2FwefTOukx3kdirb45g9S0YSjfO68RO02MElPftKKEVkm2QbnM52yk1T44gnMo0dkPVmK0yWJcTPJhLpzz2l1GyOt%2F6SnFjAMCZfd4viFDla0%2B8vAUJ07tUapTp0rpMYIlObXdcJBbsKgi45sCX6r60AolrTd4eIPHAi4lAHU5xE%2BAXNcYAjIgxxiCgufhBIIhj465AMl%2BQ2EJHPqEl9Eouv2Imt73l06eaQ0hv77ySVqYYcVCG3RcSnIuI6GApyoCKwlyH00AruU0uNJdwb2lDGM1vyBZx1tK99ZOvTTKM82htnGu3tzhCdfbRXCvmIor1Thbwa1T8hNpluTWzSRCPZulzF60OZadrGTOdLAh4A72BIdrWRSi6YVZwdCWbHEmAG06FQdk9BBmVgzODyBYWeSjBqCoI89HA0TBGNCz5Wv%2FdoVXGOBo5%2Fvk5o2iZy7TaCK8IUlcjkJcEHoBmMJ3rNtnCEyNxH9Hk3aB9%2FMkfyAk49Eiy7Io%2F3Ko9Ag%2FcRM%2BLRCr0EIQkvV7RTStNQAOOYWFxATYQYHfzkR%2Bn4iRxrlxYbXVPjaHzwxgchMcOP9EJNs7iAzXQcLigmpyNh9j2KfGJNmiNTYfYUCYzW6FgR69YWKlXsIxTAxP8lmrcOSDb1HvupxzJfAG5DKZfBwmYV7lBRZDYpyp64oij1q%2Fx5erjaBxoDR3217F%2FEbb%2FBZxRQX0Kx%2F5tp1aTgoLAaekA%2F9yhOWlO%2FNfz9eOwo5LGriMeEkrrIZTcfv8NmMpDpWGK460oMd7UhGW6dhuGmvFkzOzLcalI0NMOnfRnujIPh8Q6HMRobxd1uFD%2F26qQ7xXNSCoRsImNtgjeOZ%2FhxpWPTFDnmduVqg56Bqcop2Z2qNUniTzJmxlVZVPdOxpypusDUS8dqSVZNICtwGurxmgxeZfCxmHRqBsvd8K4MlvUMzeC%2B5TT30s9m8CiTrVHztul%2F07Blrxwe0NonaxNr4bC1eRteM%2BQdck4muYU%2BWDfPqHm59AeRGkSkl326M1TvyJh2S3PDFKT5ntMFlpCxXMfus%2BfUdFNMnCYAA%2B459RNlQWCLbgIk3rbuKjXoGToLun2z4HQMWfB%2Bnz4qtYa%2FjNXnwnrsLixTCt6SCrxaxWgQ3HggG1XfmTaYXCF22LbbL3Y4Yuygjf0ziB1SJxnIP4fq2pKuKBo4egDxF94fjx7cjc87evT7OaCpkOl6jb07Ul0oEo6TvCC00H7WG6jckrVtG1flOpDXeLUQlorDY%2B8N6ynpaGr6W460MThxK5qXIeNqwZAEIOYDTWtyotp8UHixXfJineSbj5e6bXOLNi43NRS5qaRH3r4O7ab2B9y0f8wDZtlfqPs1%2BEvHyPe%2Bn43FfTT68MVHF5yA1CW0Eiw%2BekfnoqsYgmrddS8t47Q%2BpvLVcP8EPFwstBwgRUOjYzQci5dW%2FnZgq4lylXvp7IJkWPyPMLu8%2BLcmuPkP%3C%2Fdiagram%3E%3C%2Fmxfile%3E`)
