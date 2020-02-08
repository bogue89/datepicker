
Date format definition
------------

`DatePicker` is a javascript function designed to work with both mootool's and jQuery. It makes the date and datetime selection for the user easy and convert into the format especified.

# Introductions

- Parting ways from the multiple active distributed "standards" I defined parsing dates components.

### Years
- `%Y`: 4 digits numeric representation
- `%y`: 2 digits numeric representation

### Days
- `%j`: numeric
- `%d`: 2 numeric
- `%D`: narrow weekday name string
- `%l`: short weekday name string
- `%L`: long weekday name string

### Months
- `%n`: digit numeric
- `%m`: 2 digit numeric
- `%f`: narrow string
- `%M`: short string
- `%F`: long string

### Hours
- `%h`: numeric
- `%H`: 2 digit numeric

### Minutes
- `%i`: 2 digit numeric

### Seconds
- `%s`: 2 digit numeric

### Meridians
- `%a`: lower meridian indicator
- `%A`: upper meridian indicator

### Timezone
- `%t`: short string
- `%T`: long string