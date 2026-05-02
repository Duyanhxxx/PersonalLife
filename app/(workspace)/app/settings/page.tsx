/* eslint-disable @next/next/no-img-element */
import { requireUser } from "@/lib/auth/session";
import { getWorkspaceSections } from "@/lib/workspace/sections";
import { SectionManager } from "@/components/workspace/section-manager";
import { createClient } from "@/lib/supabase/server";
import { changeAvatar, changePassword, updateDisplayName } from "@/actions/profile";

type SettingsPageProps = {
  searchParams: Promise<{ section?: string; success?: string; error?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const sections = await getWorkspaceSections(user.id);
  const activeSection =
    sections.find((s) => s.slug === params.section) ?? sections[0];

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const success = params.success;
  const hasError = params.error;

  return (
    <section className="p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Cài đặt</h1>
          <p className="mt-2 text-gray-500">
            Quản lý hồ sơ, mật khẩu và không gian làm việc của bạn.
          </p>
        </div>

        {/* Status messages */}
        {success === "password" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✓ Đổi mật khẩu thành công.
          </div>
        )}
        {success === "avatar" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✓ Cập nhật ảnh đại diện thành công.
          </div>
        )}
        {success === "name" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✓ Cập nhật tên hiển thị thành công.
          </div>
        )}
        {hasError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            ✗ Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Left: section selector */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Chọn phần
            </h2>
            {sections.map((section) => (
              <a
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  section.slug === activeSection?.slug
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                href={`/app/settings?section=${section.slug}`}
                key={section.id}
              >
                {section.name}
              </a>
            ))}
          </div>

          {/* Right: content */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">Hồ sơ cá nhân</h3>

              {/* Avatar */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                  {profile?.avatar_url ? (
                    <img alt="Avatar" className="h-full w-full object-cover" src={profile.avatar_url} />
                  ) : (
                    <span className="text-xl font-semibold text-gray-500">
                      {(profile?.display_name ?? user.email ?? "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <form action={changeAvatar} encType="multipart/form-data">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Đổi ảnh đại diện
                  </label>
                  <input accept="image/*" className="text-sm" name="avatar" type="file" required />
                  <button className="mt-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white" type="submit">
                    Tải lên
                  </button>
                </form>
              </div>

              {/* Display name */}
              <form action={updateDisplayName} className="mt-5">
                <label className="block text-xs font-medium text-gray-700">
                  Tên hiển thị
                </label>
                <input
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                  defaultValue={profile?.display_name ?? ""}
                  name="displayName"
                  placeholder="Tên của bạn"
                  type="text"
                />
                <button className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">
                  Lưu tên
                </button>
              </form>

              <p className="mt-3 text-xs text-gray-400">Email: {user.email}</p>
            </div>

            {/* Password change */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">Đổi mật khẩu</h3>
              <form action={changePassword} className="mt-4 grid gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Mật khẩu mới</label>
                  <input
                    className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    minLength={8}
                    name="password"
                    placeholder="Tối thiểu 8 ký tự"
                    type="password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <input
                    className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
                    name="confirm"
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    required
                  />
                </div>
                <button className="w-fit rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white" type="submit">
                  Cập nhật mật khẩu
                </button>
              </form>
            </div>

            {/* Section studio */}
            <div>
              <h3 className="mb-3 text-base font-semibold text-gray-900">Quản lý phần</h3>
              {activeSection ? <SectionManager activeSection={activeSection} /> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
