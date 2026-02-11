import Chart from "chart.js/auto";

let chartInstance = null;

export async function loadChart() {
  try {
    const res = await fetch("/api/chart-data");
    const data = await res.json();

    const canvas = document.getElementById("myChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // 🔥 THIS IS THE FIX
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "My Dataset",
            data: data.values,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  } catch (err) {
    console.error("Error loading chart:", err);
  }
}
