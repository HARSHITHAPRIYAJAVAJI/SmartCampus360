from app.api.api_v1.endpoints import auth, placements, admissions, academic, timetable, training, reports, utils

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(placements.router, prefix="/placements", tags=["placements"])
api_router.include_router(admissions.router, prefix="/admissions", tags=["admissions"])
api_router.include_router(academic.router, prefix="/academic", tags=["academic"])
api_router.include_router(timetable.router, prefix="/timetable", tags=["timetable"])
api_router.include_router(training.router, prefix="/training", tags=["training"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
