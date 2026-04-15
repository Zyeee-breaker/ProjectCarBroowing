export default function FormattedDate(dateString?: string | null) {
    if (!dateString) {
        return "Belum ada data";
    }

    const date = new Date(dateString);

    // cek invalid date
    if (isNaN(date.getTime())) {
        return "Belum ada data";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour12: false,
    }).format(date);
}