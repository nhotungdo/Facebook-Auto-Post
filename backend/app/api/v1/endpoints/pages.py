from fastapi import APIRouter

router = APIRouter(prefix="/facebook", tags=["facebook"])


@router.get("/pages")
async def get_facebook_pages():
    """
    Lấy danh sách Facebook Pages đã kết nối với hệ thống.
    """
    return {
        "pages": [
            {
                "id": "104928392819203",
                "name": "ABC Store",
                "connected": True,
            },
            {
                "id": "593827182938475",
                "name": "XYZ Brand",
                "connected": True,
            },
        ]
    }
