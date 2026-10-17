/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------
const danhSach = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const oTimKiem = document.getElementById("o-tim-kiem");
const khongThay = document.getElementById("khong-thay");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

const oTieuDe =
	document.getElementById("tieu-de") ||
	document.getElementById("o-tieu-de") ||
	document.getElementById("nhap-tieu-de") ||
	(nutDang && nutDang.parentNode ? nutDang.parentNode.querySelector("input") : null);

const oNoiDung =
	document.getElementById("noi-dung") ||
	document.getElementById("o-noi-dung") ||
	document.getElementById("nhap-noi-dung") ||
	(nutDang && nutDang.parentNode ? nutDang.parentNode.querySelector("textarea, input:nth-of-type(2)") : null);

// F1. Bộ đếm "Đang hiển thị x/y tin" trong #bo-dem.
function capNhatBoDem() {
	const tatCaTin = danhSach.querySelectorAll("li");
	const tinDangHien = danhSach.querySelectorAll("li:not(.an)");
	boDem.textContent = `Đang hiển thị ${tinDangHien.length}/${tatCaTin.length} tin`;
}

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup) và thông báo #khong-thay.
function locTin() {
	const tuKhoa = oTimKiem.value;
	const tuKhoaThuong = tuKhoa.toLowerCase();
	const tatCaTin = danhSach.querySelectorAll("li");
	let soTinKhop = 0;

	for (const muc of tatCaTin) {
		const tieuDe = muc.querySelector("h3") ? muc.querySelector("h3").textContent.toLowerCase() : "";
		const noiDung = muc.querySelector("p") ? muc.querySelector("p").textContent.toLowerCase() : "";

		if (tuKhoa === "" || tieuDe.includes(tuKhoaThuong) || noiDung.includes(tuKhoaThuong)) {
			muc.classList.remove("an");
			soTinKhop++;
		} else {
			muc.classList.add("an");
		}
	}

	if (soTinKhop === 0) {
		khongThay.classList.remove("an");
		khongThay.textContent = `Không tìm thấy tin nào cho "${tuKhoa}"`;
	} else {
		khongThay.classList.add("an");
	}

	capNhatBoDem();
}

oTimKiem.addEventListener("keyup", locTin);
capNhatBoDem();

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list.
danhSach.addEventListener("click", (e) => {
	if (!e.target.classList.contains("more")) {
		return;
	}
	const nut = e.target;
	const muc = nut.closest("li") || nut.parentNode;
	const doanVan = muc ? muc.querySelector("p") : null;
	if (!doanVan) {
		return;
	}

	if (doanVan.classList.contains("day-du")) {
		doanVan.classList.remove("day-du");
		nut.textContent = "Read more >>";
	} else {
		doanVan.classList.add("day-du");
		nut.textContent = "Thu gọn <<";
	}
});

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list.
nutDang.addEventListener("click", () => {
	const tieuDeMoi = oTieuDe ? oTieuDe.value : "";
	const noiDungMoi = oNoiDung ? oNoiDung.value : "";

	if (tieuDeMoi.trim() === "" || noiDungMoi.trim() === "") {
		baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
		return;
	}

	const muc = document.createElement("li");
	const ngay = document.createElement("span");
	const tieuDe = document.createElement("h3");
	const noiDung = document.createElement("p");
	const nutMore = document.createElement("button");

	ngay.className = "time";
	ngay.textContent = homNay();
	tieuDe.textContent = tieuDeMoi;
	noiDung.textContent = noiDungMoi;
	nutMore.type = "button";
	nutMore.className = "more";
	nutMore.textContent = "Read more >>";

	muc.append(ngay, tieuDe, noiDung, nutMore);
	danhSach.prepend(muc);

	oTieuDe.value = "";
	oNoiDung.value = "";
	baoLoi.textContent = "";

	locTin();
});
