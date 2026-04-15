<!DOCTYPE html>
<html>

<head>
    <title>Booking Report</title>
    <style>
        body {
            font-family: Arial;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 6px;
        }

        th {
            background: #f2f2f2;
        }
    </style>
</head>

<body>

    <h2>Booking Report</h2>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Mobil</th>
                <th>Status</th>
                <th>Total</th>
                <th>Tanggal</th>
            </tr>
        </thead>

        <tbody>
            @foreach ($bookings as $b)
                <tr>
                    <td>{{ $b->id }}</td>
                    <td>{{ $b->user->name ?? '-' }}</td>
                    <td>{{ $b->car_name }}</td>
                    <td>{{ $b->status }}</td>
                    <td>{{ number_format($b->total_price) }}</td>
                    <td>{{ $b->created_at }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>